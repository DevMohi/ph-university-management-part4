import { z } from 'zod';

const userValidationSchema = z.object({
  // id: z.string(), //auto generate hobe tai baad kore dicce 
  password: z
    .string({
      invalid_type_error : 'Password must be string'
    })
    .max(20, { message: 'Password can not be more than 20 characters' })
    .optional() //might come from either server or the user can set a database tai optional 
    ,
  // role: z.enum(['student', 'faculty', 'admin']), //endpoint theke set korbo tai validation lagbena  
  // status: z.enum(['in-progress', 'blocked']).default('in-progress'), 
  // isDeleted: z.boolean().optional().default(false), 
});

export const UserValidation = {
  userValidationSchema,
};
