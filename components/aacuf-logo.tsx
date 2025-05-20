import Image from "next/image"

type LogoProps = {
  className?: string
  variant?: "brasao" | "mascote"
  withGlow?: boolean
}

export function AACUFLogo({ className = "", variant = "brasao", withGlow = false }: LogoProps) {
  const src = variant === "brasao" ? "/images/brasao.png" : "/images/mascote.png"
  const size = variant === "brasao" ? 120 : 100 

  return (
    <div className={`relative ${className}`}>
      <Image src={src || "/placeholder.svg"} alt="AACUF" width={size} height={size} className="object-contain" />
    </div>
  )
}
