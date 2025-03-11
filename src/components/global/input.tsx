import { type ComponentProps, forwardRef } from "react"
import { tv, type VariantProps } from "tailwind-variants"

const inputVariants = tv({
    base: "outline-none border rounded-md focus:border-fisioblue py-1 px-3 shadow-shape transition-colors",

    variants: {
        sizeVariant: {
            default: "flex-1 w-full",
            small: "flex-0",
        },
        colorVariant: {
            enabled: "bg-transparent text-black",
            disabled: "bg-slate-200 text-gray-500 cursor-not-allowed",
        },
    },
    defaultVariants: {
        sizeVariant: "default",
        colorVariant: "enabled",
    },
})

interface InputProps
    extends ComponentProps<"input">,
        VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ sizeVariant, colorVariant, className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                {...props}
                className={inputVariants({ sizeVariant, colorVariant })}
                disabled={props.disabled}
            />
        )
    }
)

Input.displayName = "Input"
