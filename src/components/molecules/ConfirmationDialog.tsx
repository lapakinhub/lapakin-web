import React, {type ReactNode, useState} from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AlertDialogTemplateProps {
    title: string;
    description: string;
    cancelLabel?: string;
    actionLabel?: string;
    trigger?: ReactNode;
    onResult: (result: boolean) => void;
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
}

export const ConfirmationDialog: React.FC<AlertDialogTemplateProps> = ({
                                                                            title,
                                                                            description,
                                                                            cancelLabel = 'Cancel',
                                                                            actionLabel = 'Continue',
                                                                            trigger,
                                                                            onResult,
                                                                            isOpen: externalIsOpen,
                                                                            setIsOpen: externalSetIsOpen,
                                                                        }) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const setIsOpen =
        externalSetIsOpen !== undefined ? externalSetIsOpen : setInternalIsOpen;

    const handleAction = (result: boolean) => {
        setIsOpen(false);
        onResult(result);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && (
                <AlertDialogTrigger asChild>
                    <div
                        onClick={() => {
                            setIsOpen(true);
                        }}
                    >
                        {trigger}
                    </div>
                </AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            handleAction(false);
                        }}
                    >
                        {cancelLabel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            handleAction(true);
                        }}
                    >
                        {actionLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
