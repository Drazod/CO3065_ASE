import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LogInPage() {
  const { login } = useAuth()
  const navigate = useNavigate();

  const onSubmit = (values) => {
    login(values);
    navigate("/store");
  };

  const fieldCSS = "bg-white border rounded-md px-4 py-3";
  const buttonCSS = "bg-blue-500 rounded-xl px-4 py-3 mt-1 text-white";

  return (
    <div className='bg-blue-100 flex h-screen justify-center items-center px-8'>
      <div className='w-full md:w-[30rem] bg-white px-10 py-7 rounded-xl flex flex-col gap-10'>
        <div className='flex flex-col gap-4'>
          <img src='/assets/hcmut-logo.svg' className='h-28'/>
          <div className='flex flex-col gap-1 items-center'>
            <h1 className='font-bold text-3xl'>Sign in</h1>
            <p>to continue to SCAMS</p>
          </div>
        </div>
        <Formik
          initialValues={{ email: "johndoe@hcmut.edu.vn", password: "123456" }}
          validate={values => {
            const errors = {};
            if (!values.email) { errors.email = "Required." }
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) { errors.email = "Invalid email address." }
            return errors;
          }}
          onSubmit={(values) => onSubmit(values)}
        >
          {({ isSubmitting }) => (
            <Form className='flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor="email">Email</label>
                <Field className={fieldCSS} name="email" placeholder="Enter your email" />
              </div>
              <div className='flex flex-col gap-1'>
                <label htmlFor="password">Password</label>
                <Field className={fieldCSS} name="password" type="password" placeholder="Enter your password" />
              </div>
              <button className={buttonCSS} type="submit" disabled={isSubmitting}>
                Sign In
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
