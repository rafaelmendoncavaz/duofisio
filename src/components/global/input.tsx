import { type ComponentProps, forwardRef } from "react"
import { tv, type VariantProps } from "tailwind-variants"

const inputVariants = tv({
    base: "bg-transparent outline-none border rounded-md focus:border-fisioblue py-1 px-3 shadow-shape",

    variants: {
        sizeVariant: {
            default: "flex-1 w-full",
            small: "flex-0",
        },
    },
    defaultVariants: {
        sizeVariant: "default",
    },
})

interface InputProps
    extends ComponentProps<"input">,
        VariantProps<typeof inputVariants> {}

function Input(
    { sizeVariant, ...props }: InputProps,
    ref: React.Ref<HTMLInputElement>
) {
    return (
        <input
            ref={ref}
            {...props}
            className={inputVariants({ sizeVariant })}
        />
    )
}

const ForwardedInput = forwardRef(Input)

ForwardedInput.displayName = "Input"

export { ForwardedInput as Input }
