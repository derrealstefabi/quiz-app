import React, {useState} from "react";


export function FileInput({id, selectFile}: {
    id: string,
    selectFile: (id: string, file: File | null) => void,
}) {
    // State to hold the selected file object
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    /**
     * Handles the change event when a file is selected.
     * Updates the selectedFile state with the first file from the input.
     * @param {Object} event - The change event object from the file input.
     */
    const handleFileChange = (event: any) => {
        // Check if files exist and select the first one
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            selectFile(id, event.target.files[0]);
        } else {
            // Clear the selected file if no file is chosen (e.g., user cancels selection)
            setSelectedFile(null);
            selectFile(id, null);
        }
    };

    return (
        <div>
            <label
                htmlFor={id + "-file-upload"}
                className="block w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out text-center shadow-md hover:shadow-lg"
            >
                {selectedFile?.name ?? "Choose File"}
                <input
                    id={id + "-file-upload"}
                    type="file"
                    className="hidden" // Hide the default file input
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
}