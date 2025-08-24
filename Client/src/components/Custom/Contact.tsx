import React, {useState} from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
interface FormData{
    name:String;
    email:String;
    message:String;
}
const CONTACT_DATA=[
    {label:"Address", value:"12 Private sector , India", icon:MapPin},
    {label:"Call us", value:"0000000xyz", icon:Phone, link:"tel:000000xyz"},
    {label:"Email", value:"xyz@example.com", icon:Mail, link:"mailto:helpxyz.com"},
]
const Contact:React.FC=()=>{
 const [formData,setFormData]=useState<FormData>({
    name:"",
    email:"",
    message:""
 })
 const [submitted, setSubmitted]=useState(false);
 const [error,setError]=useState("");

 const handleChange=(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
  const {name,value}=e.target;
   setFormData(pre=>( {...pre, [name]:value}))
  
 }
 const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
 e.preventDefault()
 if(!formData.name || !formData.email || !formData.message){
    setError("Please fill in the fields!");
    return;
 }else{
    setError("");
   //set success to true
   setSubmitted(true);
   //clear data
   setFormData({name:"", email:"", message:""});
 }

 }
  return (
    <div className="max-w-7xl w-full dark:bg-black 
    bg-white p-4 flex flex-col justify-around items-start lg:flex-row md:flex-row">

        <div className="contact-info p-2 w-full mx-auto flex flex-col items-center">
            <h1 className='text-2xl md:text-3xl text-center font-bold dark:text-indigo-400 text-indigo-500 mb-4'>Contact us</h1>

            <div className="mx-auto mb-4 ">
            {CONTACT_DATA.map((item)=>{
                const Icon= item.icon;
                return (
                    <div className="flex  gap-6 items-center px-4 py-3 rounded-md hover:bg-indigo/20 text-center shadow-md backdrop-blur-lg transition-colors mt-2" key={item.label}>
                    <span className='flex items-center justify-center rounded-md text-gray-400 h-12 w-12 bg-slate-800 text-center hover:text-indigo-500 transition-colors'><Icon /></span>
                    <div className="flex flex-col justify-center gap-2 items-start">
                    <h2 className='font-bold dark:text-gray-300 text-gray-600 text-lg'>{item.label}</h2>
                   <p className='text-sm cursor-pointer dark:text-gray-400 text-gray-400 hover:text-indigo-500'>
                    {item.link? (
                         <a href={item.link} className='text-sm cursor-pointer dark:text-gray-400 text-gray-400 hover:text-indigo-500'>{item.value}</a>
                    ):
                    item.value
                    }
                    </p>
                    </div>
                    </div>
                  
                )
            })}
            </div>
        </div>
        <div className="p-2 w-full">
            <h1 className="text-2xl md:text-3xl text-center font-bold dark:text-gray-300 text-gray-600 mb-4">Get in Touch</h1>
            <form className="w-full mx-auto flex flex-col justify-center items-center gap-6 px-4 py-4 hover:border-indigo-500 font-medium" onSubmit={handleSubmit}>
              <input type="text" name='name' value={formData.name.toString()} placeholder='Enter your name' className='w-full max-w-[100%] px-6 py-2 rounded-lg bg-transparent border-2 border-gray-600 dark:text-gray-300 text-gray-50  outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-300'
              onChange={handleChange} required/>
              <input type="email" name='email' value={formData.email.toString()} placeholder='enter your email' 
              onChange={handleChange} required
              className='w-full max-w-[100%] px-6 py-2 rounded-lg bg-transparent border-2 border-gray-600 dark:text-gray-300 text-gray-50  outline-none  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 transition-all duration-200'/>

              <textarea name="message" value={formData.message.toString()} placeholder='Type Message here...'
              rows={4} className='w-full max-w-[100%] px-6 py-4 rounded-lg bg-transparent border-2 border-gray-600 dark:text-gray-300 text-gray-50  outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-200'
              onChange={handleChange} ></textarea>

              <button type="submit" className='w-[100%] max-w-[100%] mx-auto bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-xl cursor-pointer border-none font-medium transition  duration-300 text-white'>Send Message</button>
            </form>
               {error && <p className='text-red-500 text-xl text-center'>{error}</p>}
           {submitted && (
             <h2 className='font-medium text-center p-4 text-2xl dark:text-indigo-400 text-black'>Thank You for contacting us</h2>)}
          
        
 </div>

    </div>
  )
}
export default Contact;

