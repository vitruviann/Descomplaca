import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, File } from 'lucide-react';

const Upload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        const sessionId = localStorage.getItem('session_id') || 'unknown';

        try {
            const res = await fetch(`http://127.0.0.1:8000/upload/${sessionId}`, {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                navigate('/progress');
            } else {
                alert("Erro no envio do arquivo.");
            }
        } catch (e) {
            console.error(e);
            navigate('/progress'); // Bypass for demo
        }
        setUploading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Envio de Documentos</h2>

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-dashed border-blue-300 flex flex-col items-center text-center">
                <input
                    type="file"
                    id="fileData"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf"
                />

                {file ? (
                    <div className="flex flex-col items-center">
                        <File size={48} className="text-blue-500 mb-2" />
                        <span className="font-semibold text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</span>
                        <button onClick={() => setFile(null)} className="text-red-500 text-xs mt-2 underline">Remover</button>
                    </div>
                ) : (
                    <label htmlFor="fileData" className="cursor-pointer flex flex-col items-center">
                        <UploadIcon size={48} className="text-gray-300 mb-2" />
                        <span className="text-blue-600 font-bold hover:underline">Clique para selecionar</span>
                        <span className="text-xs text-gray-400 mt-1">PDF, JPG ou PNG</span>
                    </label>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
                {uploading ? "Enviando..." : "Enviar Documento"}
            </button>
        </div>
    );
};

export default Upload;
