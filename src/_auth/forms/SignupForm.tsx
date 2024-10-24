import { Button, buttonVariants } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { checkRegisteredUser } from "@/lib/appwrite/api"
import { ToastAction } from "@/components/ui/toast"
import { cn } from "@/lib/utils"



const SignupForm = () => {
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    mode: "onSubmit",
    defaultValues: {
      username: '',
      name: '',
      email: '',
      password: ''
    },
  })
  const { reset, handleSubmit, control } = form

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount()
  const { mutateAsync: signInAccount } = useSignInAccount()


  const onSubmit = async (values: z.infer<typeof SignupValidation>) => {
    // Check is user registered
    const registeredUser = await checkRegisteredUser({
      email: values.email,
      username: values.username
    })
    if (registeredUser && registeredUser.length > 0) {
      return toast({
        title: 'This email or username is already registered. Please sign in instead.',
        action: <ToastAction altText="Sign in" onClick={() => navigate('/signin')}>Go to Sign in</ToastAction>
      })
    }

    // if user not registered, sign up 
    const newUser = await createUserAccount(values)

    if (!newUser) {
      toast({ title: 'Sign up failed. Please try again' })

      return;
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if (session?.error?.code === 'email_not_confirmed') {
      reset()
      return toast({ title: 'A verification link has already been sent. Please check your email inbox.' });
    } else if (!!session?.error) {
      return toast({ title: 'Sign in failed. Please try again' })
    }

    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      reset()
      navigate('/')
    } else {
      return toast({ title: 'Sign up failed. Please try again' })
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <div className="flex flex-row gap-2">
          <img src="/assets/image/side-img.gif" alt="logo" className="w-8 h-8" />
          <h2 className="text-2xl italic font-semibold text-primary">IFCAbsence</h2>
        </div>

        <h2 className="text-xl font-semibold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-light-3 text-xs md:base-regular mt-2">
          To use IFCABsence, please enter your details</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            disabled={isCreatingAccount}
          >
            {isCreatingAccount
              ?
              <div className="flex flex-row gap-2">
                <Loader /> Loading...
              </div>
              :
              "Sign up"
            }
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to={"/signin"} className={cn(buttonVariants({ variant: "link" }), "text-primary-500 text-small-semibold ml-1")}>
              Log in
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

export default SignupForm