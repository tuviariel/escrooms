import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Sortable = (props: any) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    // console.log("Sortable props:", props);
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {props.children}
        </div>
    );
};
