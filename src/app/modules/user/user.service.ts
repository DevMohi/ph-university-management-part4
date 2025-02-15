import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';

const createStudentIntoDB = async (password: string, payLoad: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';

  //find academic Semester info

  const admissionSemester: any = await AcademicSemester.findById(
    payLoad.admissionSemester,
  );

  //isolated enviroment
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //set manually generated id
    userData.id = await generateStudentId(admissionSemester);

    //create a user (transaction 1) , transaction k data array hishebe dite hoi
    const newUser = await User.create([userData], { session });

    //create a student
    if (!newUser.length) {
      throw new AppError(400, 'Failed to create user');
    }
    //set id , _id as user
    payLoad.id = newUser[0].id; //embedding id
    payLoad.user = newUser[0]._id; //reference id

    //Create a student (transaction - 2)
    const newStudent = await Student.create([payLoad], { session });
    if (!newStudent.length) {
      throw new AppError(400, 'Failed to create student');
    }

    //eitotuk chole asche mane transaction succesfull
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
};
