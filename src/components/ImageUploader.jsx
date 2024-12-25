import { Button } from '@mui/material'

export default function ImageUploader({ onUpload, label }) {
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        onUpload(file)
    }

    return (
        <Button variant="contained" component="label">
            {label}
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
    )
}
