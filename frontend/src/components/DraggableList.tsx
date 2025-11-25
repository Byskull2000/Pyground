import { useState } from 'react';
import {
    GripVertical,
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


interface DraggableItem {
    id: number;
    orden: number;
}

interface SortableItemProps<T extends DraggableItem> {
    item: T;
    renderContent: (item: T) => React.ReactNode;
}

function SortableItem<T extends DraggableItem>({
    item,
    renderContent
}: SortableItemProps<T>) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-gray-800/50 border border-white/10 rounded-lg p-4 hover:border-purple-400/50 transition-all"

        >
            <div className=" flex items-center gap-4">
                <div
                    {...attributes}
                    {...listeners}
                    className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex-1 min-w-0">
                    {renderContent(item)}
                </div>


            </div>
        </div>
    );
}

interface DraggableListProps<T extends DraggableItem> {
    items: T[];
    onReorder: (reorderedItems: T[]) => Promise<void>;
    onEdit?: (item: T) => void;
    onDelete?: (id: number) => void;
    renderItem: (item: T) => React.ReactNode;
    emptyState?: React.ReactNode;
}

export function DraggableList<T extends DraggableItem>({
    items,
    onReorder,
    renderItem,
    emptyState
}: DraggableListProps<T>) {
    const [localItems, setLocalItems] = useState(items);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = localItems.findIndex((item) => item.id === active.id);
        const newIndex = localItems.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(localItems, oldIndex, newIndex);

        const updatedItems = newItems.map((item, index) => ({
            ...item,
            orden: index + 1
        }));

        setLocalItems(updatedItems);

        try {
            await onReorder(updatedItems);
        } catch (err) {
            console.error('Error al reordenar:', err);
            setLocalItems(localItems);
        }
    };

    // Actualizar localItems cuando items cambie
    useState(() => {
        setLocalItems(items);
    });

    if (localItems.length === 0 && emptyState) {
        return <>{emptyState}</>;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={localItems.map(item => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-4">
                    {localItems.map((item) => (
                        <SortableItem
                            key={item.id}
                            item={item}
                            renderContent={renderItem}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
