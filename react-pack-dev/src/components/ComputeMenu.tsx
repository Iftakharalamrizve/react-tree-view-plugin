
interface Props {
    title:string
}

export function ComputeMenu(props: Props) {
    const {title} = props

    return (
        <div>
             <p>Hello {title}</p>   
        </div>
    )
}
