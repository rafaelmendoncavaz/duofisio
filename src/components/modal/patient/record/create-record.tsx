import { useState } from "react";
import { CreateRecordForm } from "../../../forms/create-record-form";
import { RecordHistory } from "./record-history";

interface CreateRecordProps {
    setClinicalHistory: (isOpen: boolean) => void;
}

export function CreateRecord({ setClinicalHistory }: CreateRecordProps) {
    const [isCreateRecord, setIsCreateRecord] = useState(false);

    const openCreateRecord = () => setIsCreateRecord(true);

    const closeCreateRecord = () => setIsCreateRecord(false);

    const closeClinicalHistory = () => {
        setClinicalHistory(false);
    };

    return (
        <section className="flex flex-col gap-4">
            {isCreateRecord ? (
                <CreateRecordForm closeCreateRecord={closeCreateRecord} />
            ) : (
                <RecordHistory
                    openCreateRecord={openCreateRecord}
                    closeClinicalHistory={closeClinicalHistory}
                />
            )}
        </section>
    );
}
