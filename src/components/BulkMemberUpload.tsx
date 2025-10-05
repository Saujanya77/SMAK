import React, { useState } from "react";
import * as XLSX from "xlsx";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "./ui/button";

const BulkMemberUpload: React.FC = () => {
    const [uploading, setUploading] = useState(false);
    const [successCount, setSuccessCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [errors, setErrors] = useState<string[]>([]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setSuccessCount(0);
        setErrorCount(0);
        setErrors([]);
        // Define all possible required field keys (from your sample Excel)
        const requiredFields = ["Name", "Name ", "Full Name", "name", "Institution", "institution", "College", "college"];
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows: any[] = XLSX.utils.sheet_to_json(worksheet);
            let success = 0;
            let fail = 0;
            let errorList: string[] = [];
            for (const row of rows) {
                // Try all possible keys for name and institution
                const name = row["Name"] || row["Name "] || row["Full Name"] || row["name"];
                const institution = row["Institution"] || row["institution"] || row["College"] || row["college"];
                // Add other fields as needed
                const member: any = {
                    name,
                    institution,
                    designation: row["Designation"] || row["Role"] || row["designation"] || "Member",
                };
                if (row["Email"] || row["email"]) member.email = row["Email"] || row["email"];
                if (row["Phone"] || row["phone"]) member.phone = row["Phone"] || row["phone"];
                if (row["Picture"] || row["Image"] || row["pictureUrl"]) member.pictureUrl = row["Picture"] || row["Image"] || row["pictureUrl"];
                if (row["Serial No."] || row["Serial No"] || row["serialNo"]) member.serialNo = row["Serial No."] || row["Serial No"] || row["serialNo"];
                // Check for missing required fields
                if (!name || !institution) {
                    fail++;
                    let missing = [];
                    if (!name) missing.push("Name");
                    if (!institution) missing.push("Institution/College");
                    errorList.push(`Missing required field(s) (${missing.join(", ")}) in row: ${JSON.stringify(row)}`);
                    continue;
                }
                try {
                    await addDoc(collection(db, "members"), member);
                    success++;
                } catch (err: any) {
                    fail++;
                    errorList.push(`Error adding member: ${member.name}. Reason: ${err?.message || err}`);
                }
            }
            setSuccessCount(success);
            setErrorCount(fail);
            setErrors(errorList);
        } catch (err) {
            setErrors(["Failed to read file. Please upload a valid Excel file."]);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Bulk Upload Members (Excel)</h2>
            <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={uploading}
                className="mb-4"
            />
            <Button disabled={uploading} className="mb-4">
                {uploading ? "Uploading..." : "Upload Excel File"}
            </Button>
            <div className="mt-4">
                {successCount > 0 && (
                    <div className="text-green-600 font-semibold mb-2">
                        Successfully added {successCount} members.
                    </div>
                )}
                {errorCount > 0 && (
                    <div className="text-red-600 font-semibold mb-2">
                        {errorCount} errors occurred.
                    </div>
                )}
                {errors.length > 0 && (
                    <ul className="text-sm text-red-500 list-disc pl-5">
                        {errors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="mt-4 text-gray-600 text-sm">
                <strong>Instructions:</strong>
                <ul className="list-disc pl-5">
                    <li>Upload an Excel file (.xlsx or .xls) with columns: Name, Institution/College, Email, Designation, Phone, Picture, Serial No.</li>
                    <li>Required columns: Name (or Name with space), Institution/College (or College/college).</li>
                    <li>Each row will be added as a member in Firestore. All fields in your sheet will be saved.</li>
                </ul>
            </div>
        </div>
    );
};

export default BulkMemberUpload;
