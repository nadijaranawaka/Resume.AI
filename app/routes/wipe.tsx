import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";

const WipeApp = () => {
    const {isLoading,auth, fs, kv, error, clearError} = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);
    useEffect(() => {
        if (isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe")
        }
    }, [isLoading]);

    const handleDelete = async() => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        loadFiles()
    };
    if (isLoading){
        return <div>Loading...</div>
    }
    if (error){
        return <div>Error {error}</div>
    }
    return (
        <div>
            Authenticated as: {auth.user?.username}
            <div>Existing Files</div>
            <div className={"flex flex-col gap-4"}>
                {files.map((file) => (
                    <div key={file.id} className={"flex flex-row gap-4"}>
                        <p>{file.name}</p>
                    </div>
                ))};
            </div>
            <div>
                <button
                    className={"bg-green-800 text-white px-4 py-2 rounded-md cursor-pointer"}
                    onClick={() => handleDelete()}
                >
                    Wipe App Data
                </button>
            </div>
        </div>
    )
};

export default WipeApp;