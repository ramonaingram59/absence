import { Loader2 } from "lucide-react"

const Loader = ({ color = 'white' }: { color?: string }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <Loader2 className="animate-spin" color={color} />
    </div>
  )
}

export default Loader