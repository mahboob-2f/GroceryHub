import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import ButtonLoader from './ButtonLoader';

const Login = () => {
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [isOtpStep, setIsOtpStep] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const {setShowUserLogin,setUser,axios,navigate}= useContext(AppContext);

    const resetRegisterFlow = () => {
        setOtp("");
        setIsOtpStep(false);
        setIsSubmitting(false);
    }

    const switchAuthState = (nextState) => {
        setState(nextState);
        resetRegisterFlow();
    }

    const submitHandler = async (e)=>{
        try {
            e.preventDefault();
            setIsSubmitting(true);

            if (state === "register" && !isOtpStep) {
                const { data } = await axios.post(
                    '/api/user/register/send-otp',
                    { name, email, password },
                    { withCredentials: true }
                );

                if (data.success) {
                    toast.success(data.message);
                    setIsOtpStep(true);
                } else {
                    toast.error(data.message);
                }
                return;
            }

            const requestPayload =
                state === "register"
                    ? { email, otp }
                    : { name, email, password };

            const {data}= await axios.post(`/api/user/${state}`,requestPayload,{ withCredentials: true });
            if(data.success){
                toast.success(data.message);
                setUser(data.user);
                resetRegisterFlow();
                setShowUserLogin(false);
                navigate('/');
            }else{
                toast.error(data.message)
            }
            } catch (error) {
                toast.error(error.message)
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'
            onClick={()=>setShowUserLogin(false)}
        >
            <form onSubmit={submitHandler} onClick={(e)=> e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px]
                 text-gray-500 rounded-lg shadow-xl border border-primary bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "login" : "register"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here"
                            className="border border-primary rounded w-full p-2 mt-1 outline-primary disabled:bg-gray-100" type="text" required disabled={isOtpStep} />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here"
                        className="border border-primary rounded w-full p-2 mt-1 outline-primary disabled:bg-gray-100" type="email" required disabled={state === "register" && isOtpStep} />
                </div>
                {state === "register" && isOtpStep ? (
                    <>
                        <div className="w-full ">
                            <p>OTP</p>
                            <input
                                onChange={(e) => setOtp(e.target.value)}
                                value={otp}
                                placeholder="Enter 6-digit OTP"
                                className="border border-primary rounded w-full p-2 mt-1 outline-primary"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            We sent a verification code to your email. Your account will be created only after OTP verification.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setOtp("");
                                setIsOtpStep(false);
                            }}
                            className="text-primary cursor-pointer"
                        >
                            Edit registration details
                        </button>
                    </>
                ) : (
                    <div className="w-full ">
                        <p>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here"
                            className="border border-primary rounded w-full p-2 mt-1 outline-primary" type="password" required />
                    </div>
                )}
                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => switchAuthState("login")}
                            className="text-primary cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => switchAuthState("register")}
                            className="text-primary cursor-pointer">click here</span>
                    </p>
                )}
                <button disabled={isSubmitting} className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 
                    rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-70">
                    <span className='flex items-center justify-center gap-2'>
                        {isSubmitting && <ButtonLoader />}
                        {state === "register" ? (isOtpStep ? "Verify OTP" : "Send OTP") : "login"}
                    </span>
                </button>
                {state === "register" && isOtpStep && (
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={async () => {
                            try {
                                setIsSubmitting(true);
                                const { data } = await axios.post(
                                    '/api/user/register/send-otp',
                                    { name, email, password },
                                    { withCredentials: true }
                                );
                                if (data.success) {
                                    toast.success("A new OTP has been sent to your email");
                                } else {
                                    toast.error(data.message);
                                }
                            } catch (error) {
                                toast.error(error.message);
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                        className="text-primary w-full text-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        Resend OTP
                    </button>
                )}
            </form>
        </div>
    );
};

export default Login;
