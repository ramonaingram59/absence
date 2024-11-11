import { Button, buttonVariants } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useSignInAccount } from "@/lib/react-query/auth/authQueries"
import { useUserContext } from "@/context/AuthContext"
import { cn } from "@/lib/utils"



const SigninForm = () => {
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    mode: "onSubmit",
    defaultValues: {
      email: '',
      password: ''
    },
  })
  const { reset, handleSubmit, control } = form

  const { mutateAsync: signInAccount, isPending: isSigninIn } = useSignInAccount()


  const onSubmit = async (data: z.infer<typeof SigninValidation>) => {

    const session = await signInAccount(data)

    if (!session) {
      toast.error('No Session. Please try again')
      return
    }

    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      reset()
      navigate('/')
    } else {
      toast.error('Sign in failed. Please try again')
      return
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex justify-center items-center flex-col">
        <div className="flex flex-row gap-2">
          <img src="/assets/image/side-img.gif" alt="logo" className="w-8 h-8" />
          <h2 className="text-2xl italic font-semibold text-primary">IFCAbsence</h2>
        </div>

        <h2 className="text-xl font-semibold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
        <p className="text-light-3 text-xs md:base-regular mt-2">
          Welcome back! Please enter your details
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary hover:invert-dark"
            disabled={isUserLoading || isSigninIn}
          >
            {isUserLoading || isSigninIn
              ?
              <div className="flex flex-row gap-2">
                <Loader /> Loading...
              </div>
              :
              "Sign in"
            }
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link to={"/signup"} className={cn(buttonVariants({ variant: "link" }), "text-primary-500 text-small-semibold ml-1")}>
              Sign up
            </Link>
          </p>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2 px-12">
          By clicking continue, you agree to our{" "}
          <span className="underline">Terms of Service</span>
          {" "}and{" "}
          <span className="underline">Privacy Policy.</span>
        </p>
      </div>

    </Form>
  )
}

export default SigninForm