const InputField = ({ label, id, name, type = 'text', onChange, value, required = false }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                className="mt-1 w-full rounded-md border p-2 text-black transition-colors duration-300 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    )
}

export default InputField
