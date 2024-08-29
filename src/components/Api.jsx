import { useState, useEffect } from "react"

export default function Api() {
    const [taxpayers, setTaxpayers] = useState([])//State para almacenar el objeto 
    const [loading, setLoading] = useState(true)//Almacena el tiempo en que carga la API  
    const [error, setError] = useState(null)//Carga los errores
    const [expandedIndex, setExpandedIndex] = useState(null)//Expande los taxpayers
    const [formErrors, setFormErrors] = useState([])
    const [isAdding, setIsAdding] = useState(false)


    useEffect( () => {

        const url = 'https://ynhumjrgo3.execute-api.us-east-1.amazonaws.com/v1/taxpayers'
         
        fetch(url)

        .then(response => {
            if(!response.ok) {
                throw new Error('No fue posible acceder')
            }
            return response.json()
        })
        .then(responseData => {
            //Validación de la Api si el "object" del responseData es igual a 'list' y verifica si es un arreglo 
            if(responseData.object === 'list' && Array.
                isArray(responseData.data)) {
                setTaxpayers(responseData.data)
            } else {
                throw new Error('Formato de datos inesperados')
            }

            setLoading(false)
        })
        .catch(error =>{
            setError(error)
            setLoading(false)
        })

    }, [])

    //Ayuda a ocultar o mostrar la información
    const toggleExpand = index => {
        if(expandedIndex === index) {
            setExpandedIndex(null)
        }else {
            setExpandedIndex(index)
        }
    }

    //Agrega nuevos "taxpayers" 
    const handleAddTaxpayer = () => {
        setTaxpayers([...taxpayers, {name:'', email: '', phone_number:'', rfc:'', address:''}])
        //Representa el indice y expande para que se pueda agregar información 
        setExpandedIndex(taxpayers.length)
        setIsAdding(true)
    }

    //Validaciones de los campos 
    const handleErrorForms = () => {
        const errors = []
        taxpayers.forEach((taxpayer, index) => {
            
            const {name, email, phone_number, created_at, address} = taxpayer
            const error = {}
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            console.log(error)
            
            if(!name) error.name = "Nombre requerido"
             if (!email || !emailRegex.test(email)) error.email = "Email invalido"
            if(!phone_number || !/^\d{10}$/.test(phone_number)) error.phone_number = "Numero invalido"
            if(!address) error.address = "Dirección requerida"

            errors[index] = error

        })
        setFormErrors(errors)
        return errors.every(error => Object.keys(error). length === 0)
        // return errors.length === 0
    }

    const handleSubmit = (e, index) => {
        e.preventDefault()
    if (handleErrorForms()) {
        if(isAdding) {
            setIsAdding(false)
            // handleAddTaxpayer()
            return
        }
            // handleAddTaxpayer()
            // setIsAdding(false)
            // return
        } 
    }
    //El primer valor representa el indice del taxpayer, field el nombre del campo y value el nuevo valor que se ha ingresado
    const handleInputChange = (index, field, value) => {
        const updatedTaxpayers = [...taxpayers]
        //Actualiza el campo especifico 
        updatedTaxpayers[index][field] = value
        setTaxpayers(updatedTaxpayers)
    }


    if(loading) return <p className="text-center text-blue-900 font-bold text-3xl">Cargando...</p>
    if(error) return <p className="text-center text-blue-900 font-bold text-3xl"> Error: {error.message}</p>


    return(
        <div className= "max-w-3xl mx-auto rounded-md">
            
            <h2 className="text-center p-4 text-cyan-900 font-semibold text-xl">Taxpayer Form</h2>

            {taxpayers.map((taxpayer, index) =>(

                <div key={index} className=" border bg-white m-4 rounded-md overflow-hidden">                    
                    <div className="flex">
                        
                        <div className="bg-blue-800 text-white flex items-center justify-center w-16">
                            <span className="text-xl font-bold">{index + 1}</span>
                        </div>
                        
                        <div className="flex-grow p-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">{taxpayer.name || 'New Taxpayer'}</h2>
                            
                            <button 
                            onClick={() => toggleExpand(index)}
                            className="text-gray-500"
                            >
                            {expandedIndex === index 
                                ? <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                                : <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"></path></svg>
                            }
                            </button>

                        </div>
                    </div>
                    {/* Se muestra el formulario con los campos llenos de la Api */}
                    {expandedIndex === index && (
                        <>
                            <hr className="divide-y w-full border-gray-300 my-4" />
                            <form onSubmit={handleSubmit} className=" bg-white p-4 my-4 rounded-md">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={taxpayer.name}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                        />
                                        {formErrors[index]?.name && <p className="text-red-500 text-sm">{formErrors[index].name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={taxpayer.email}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            onChange={(e)=> handleInputChange(index, 'email', e.target.value)}
                                        />
                                        {formErrors[index]?.email && <p className="text-red-500 text-sm">{formErrors[index].email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone number</label>
                                        <input 
                                            type="tel"
                                            name="phone_number" 
                                            value={taxpayer.phone_number} 
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            onChange={(e) => handleInputChange(index, 'phone_number', e.target.value)}    
                                        />
                                        
                                        {formErrors[index]?.phone_number && <p className="text-red-500 text-sm">{formErrors[index].phone_number}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">RFC</label>
                                        <input 
                                            type="text" 
                                            name="rfc"
                                            value={taxpayer.created_at}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            onChange={(e)=> handleInputChange(index, 'created_at', e.target.value)}
                                        />
                                        
                                        {formErrors[index]?.created_at && <p className="text-red-500 text-sm">{formErrors[index].created_at}</p>}
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <input 
                                            type="text" 
                                            name="address"
                                            value={taxpayer.address}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            onChange={(e)=> handleInputChange(index, 'address', e.target.value)}
                                        />
                                        
                                        {formErrors[index]?.address && <p className="text-red-500 text-sm">{formErrors[index].address}</p>}
                                    </div>

                                </div>
                                
                            {/* Validacion para que solo apareza el boton en los nuevos taxpayers */}
                              {isAdding && index === taxpayers.length -1 && (
                                  <div className="flex justify-end">
                                  <button
                                       type="submit"
                                       className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md border"
                                   >
                                    {index === taxpayers.length -1 && isAdding ? 'Add taxpayer' : 'Update taxpayer'}
                                   </button>
                               </div>
                              )}
                            </form>
                        </>
                    )}
                </div>
            ))}
            {!isAdding && (
                <div className="text-center">
                <button
                    onClick={handleAddTaxpayer}
                    className="border-none text-blue-800 font-bold underline px-4 py-2 m-4"
                >
                    +Add another taxpayer
                </button>
            </div>
            )}
        </div>
    )
}