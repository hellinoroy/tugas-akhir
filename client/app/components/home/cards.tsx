
interface Cards {
    icon: React.ComponentType<React.ComponentProps<'svg'>>; 
    heading: string,
    number: number,
    paragraph: string,
}

export default function Cards({icon: Icon, number, heading, paragraph}: Cards){
    return ( 
        <div className="flex flex-col items-center p-10 rounded">   
            <div className="rounded-full bg-stone-100 p-5">
                <Icon className="size-20"/>
            </div>
            
            <div className="flex flex-row gap-2 items-center">
                <h2 className="font-bold text-1xl md:text-2xl rounded-full p-2 size-10 shrink-0 flex items-center justify-center bg-stone-100">{number}</h2>
                <h4 className="text-2xl my-4 text-center">{heading}</h4>
            </div>

            <h5 className="text-center text-lg md:text-xl max-w-90 text-slate-600">{paragraph}</h5>
            
        </div>
    )
} 