import { Plus } from "lucide-react"

const AddResource = ({ onAddResource }) => {
  return (
    <div className="absolute z-20 right-25 top-2 cursor-pointer flex items-center justify-between p-4">
      <button
        className="px-4 cursor-pointer py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        onClick={onAddResource}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Resource
      </button>
    </div>
  )
}

export default AddResource

