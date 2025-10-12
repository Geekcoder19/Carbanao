import React from "react";
import ContactForm from "./ContactForm";
import ContactInformation from "./ContactInformation";
import letterSend from "../../assets/cutLayouts/letter_send.png"

export default function FormContainer() {
  return (
    <div className="relative p-2 h-full   gap-y-16 lg:flex-row bg-white flex flex-col lg:items-center rounded-xl  shadow-all-over overflow-hidden">
      {/* Contact information */}
      <ContactInformation />
      <ContactForm />
      <img src={letterSend} alt="vectore image" className="absolute w-48 right-0 bottom-0 -rotate-[60.75deg]" />
    </div>
  );
}
