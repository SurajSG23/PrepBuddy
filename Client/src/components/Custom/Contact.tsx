import React, {useState} from 'react';
import { useThemeSelector } from "../../store/hooks";
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
 const darkMode = useThemeSelector((state) => state.theme.darkMode);

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
    <div
      className={`max-w-7xl w-full p-4 flex flex-col justify-around items-start lg:flex-row md:flex-row ${
        darkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div className="contact-info p-2 w-full mx-auto flex flex-col items-center">
        <h1
          className={`text-2xl md:text-3xl text-center font-bold mb-4 ${
            darkMode ? "text-indigo-400" : "text-indigo-500"
          }`}
        >
          Contact us
        </h1>
        <div className="mx-auto mb-4 ">
          {CONTACT_DATA.map((item) => {
            const Icon = item.icon;
            return (
              <div
                className={`flex gap-6 items-center px-4 py-3 rounded-md text-center shadow-md backdrop-blur-lg transition-colors mt-2 ${
                  darkMode
                    ? "hover:bg-indigo-900/20 bg-gray-900"
                    : "hover:bg-indigo-100/40 bg-gray-100"
                }`}
                key={item.label}
              >
                <span
                  className={`flex items-center justify-center rounded-md h-12 w-12 text-center transition-colors ${
                    darkMode
                      ? "text-gray-400 bg-slate-800 hover:text-indigo-400"
                      : "text-indigo-500 bg-indigo-100 hover:text-indigo-700"
                  }`}
                >
                  <Icon />
                </span>
                <div className="flex flex-col justify-center gap-2 items-start">
                  <h2
                    className={`font-bold text-lg ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </h2>
                  <p
                    className={`text-sm cursor-pointer hover:text-indigo-500 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {item.link ? (
                      <a
                        href={item.link}
                        className={`text-sm cursor-pointer hover:text-indigo-500 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-2 w-full">
        <h1
          className={`text-2xl md:text-3xl text-center font-bold mb-4 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Get in Touch
        </h1>
        <form
          className={`w-full mx-auto flex flex-col justify-center items-center gap-6 px-4 py-4 font-medium ${
            darkMode ? "hover:border-indigo-400" : "hover:border-indigo-500"
          }`}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            value={formData.name.toString()}
            placeholder="Enter your name"
            className={`w-full max-w-[100%] px-6 py-2 rounded-lg border-2 outline-none transition-all duration-300 ${
              darkMode
                ? "bg-gray-900 border-gray-600 text-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                : "bg-white border-gray-300 text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            }`}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email.toString()}
            placeholder="enter your email"
            onChange={handleChange}
            required
            className={`w-full max-w-[100%] px-6 py-2 rounded-lg border-2 outline-none transition-all duration-200 ${
              darkMode
                ? "bg-gray-900 border-gray-600 text-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                : "bg-white border-gray-300 text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            }`}
          />
          <textarea
            name="message"
            value={formData.message.toString()}
            placeholder="Type Message here..."
            rows={4}
            className={`w-full max-w-[100%] px-6 py-4 rounded-lg border-2 outline-none transition-all duration-200 ${
              darkMode
                ? "bg-gray-900 border-gray-600 text-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                : "bg-white border-gray-300 text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            }`}
            onChange={handleChange}
          ></textarea>
          <button
            type="submit"
            className={`w-[100%] max-w-[100%] mx-auto px-5 py-2 rounded-xl cursor-pointer border-none font-medium transition duration-300 ${
              darkMode
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            Send Message
          </button>
        </form>
        {error && <p className="text-red-500 text-xl text-center">{error}</p>}
        {submitted && (
          <h2
            className={`font-medium text-center p-4 text-2xl ${
              darkMode ? "text-indigo-400" : "text-black"
            }`}
          >
            Thank You for contacting us
          </h2>
        )}
      </div>
    </div>
  );
}
export default Contact;