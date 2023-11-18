"use client"

import React, {useRef, useEffect} from 'react'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'
import {QuestionMarkCircleIcon} from "@heroicons/react/24/outline";

type DialogProps = {
    title: string,
    onClose: () => void,
    onOk: () => void,
    children: React.ReactNode,
    showDialog: boolean // Zustandsvariable zur Steuerung der Anzeige
}

export default function ModalDialog({title, onClose, onOk, children, showDialog}: DialogProps) {
    const dialogRef = useRef<null | HTMLDialogElement>(null)

    useEffect(() => {
        if (showDialog) {
            dialogRef.current?.showModal()
        } else {
            dialogRef.current?.close()
        }
    }, [showDialog])

    const closeDialog = () => {
        dialogRef.current?.close()
        onClose()
    }

    const clickOk = () => {
        onOk()
        closeDialog()
    }

    return (
        showDialog && (
            <dialog ref={dialogRef}
                    className="fixed top-50 left-50 -translate-x-50 -translate-y-50 z-10  rounded-xl backdrop:bg-gray-800/50">
                <div className="w-[500px] max-w-fullbg-gray-200 flex flex-col">
                    <div className="flex flex-row justify-between mb-4 pt-2 px-5 bg-gray-200">
                        <h1 className="text-2xl">{title}</h1>

                        <XCircleIcon className="w-6 h-6" onClick={closeDialog}
                                     onMouseOver={(e) => e.currentTarget.style.color = 'red'}
                                     onMouseOut={(e) => e.currentTarget.style.color = 'gray'} // Setzen Sie hier die ursprüngliche Farbe

                        />


                    </div>
                    <div className="px-5 pb-6">
                        {children}
                        <div className="flex flex-row justify-end mt-2">
                            <button
                                onClick={clickOk}
                                className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                Speichern
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>
        )
    )
}

