// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { Users, Stethoscope, Activity, FileText } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  const services = [
    { title: "Executive Health Package", icon: <Activity className="w-8 h-8 text-blue-600" /> },
    { title: "Home Collection Services", icon: <Stethoscope className="w-8 h-8 text-green-600" /> },
    { title: "All Doctors", icon: <Users className="w-8 h-8 text-purple-600" /> },
    { title: "All Tests", icon: <FileText className="w-8 h-8 text-red-600" /> },
  ];

  const doctors = [
    { name: "Dr. Sajib Chowdhury", dept: "Medicine" },
    { name: "Prof. Ghulam Kawser", dept: "Neuromedicine" },
    { name: "Dr. Panchanan Acharjee", dept: "Psychiatry" },
    { name: "Dr. Md. Nasim Uddin", dept: "Cardiology" },
  ];

  const testimonials = [
    { name: "Rahim Ahmed", text: "Very professional doctors and the online report system is extremely convenient." },
    { name: "Fatema Khan", text: "Booking appointments online saved me a lot of time." },
    { name: "Mahmud Hasan", text: "Great healthcare platform with trusted doctors." },
  ];

  return (
    <div className="font-sans text-gray-800">

      {/* NAVBAR */}
<nav className="bg-white shadow">
  <div className="container mx-auto px-6 py-4 flex justify-between items-center">
    <Link to="/" className="text-2xl font-bold text-blue-600">HealthCare+</Link>
    <div className="flex gap-4">
      {user ? (
        <Link to={`/${user.role}/dashboard`}>
          <Button className="px-6 py-3 text-lg">Dashboard →</Button>
        </Link>
      ) : (
        <>
          <Link to="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </>
      )}
    </div>
  </div>
</nav>
      {/* HERO */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl font-bold leading-tight">Your Trusted Digital Healthcare Platform</h1>
            <p className="text-lg text-gray-700">
              Book appointments, view lab reports, consult verified doctors, and manage your health securely from one platform.
            </p>
            <div className="flex gap-4">
              <Link to="/register">
                <Button className="px-6 py-3 text-lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="px-6 py-3 text-lg">Sign In</Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <Card className="w-64 h-64 flex items-center justify-center bg-blue-100">
              <Stethoscope className="w-16 h-16 text-blue-600" />
            </Card>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((s) => (
              <Card key={s.title} className="text-center p-6 space-y-4">
                <div className="flex justify-center">{s.icon}</div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <Button variant="outline" className="w-full">View Details</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Doctors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {doctors.map((d) => (
              <Card key={d.name} className="text-center p-6 space-y-4">
                <Avatar className="mx-auto w-20 h-20">
                  <AvatarFallback>{d.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{d.name}</h3>
                <p className="text-gray-500">{d.dept}</p>
                <Button variant="outline" className="w-full">View Profile</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Patients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6">
                <CardContent>
                  <p className="italic text-gray-700">"{t.text}"</p>
                  <p className="mt-4 font-semibold">{t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

   {/* FINAL CTA */}
<section className="py-28 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
  <div className="container mx-auto px-6 space-y-6">
    <h2 className="text-5xl font-extrabold leading-tight">Take Control of Your Health Today</h2>
    <p className="text-xl text-gray-200 max-w-xl mx-auto">
      Join thousands of patients managing their health securely and efficiently with our platform.
    </p>
    <Link to="/register">
      <Button className="px-10 py-4 text-lg bg-black text-black-600 font-semibold rounded-lg hover:bg-white-100 transition-all duration-300">
  Create Free Account
</Button>
    </Link>
  </div>
</section>

{/* FOOTER */}
<footer className="bg-gray-900 text-gray-300 py-16">
  <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* Contact */}
    <div>
      <h4 className="font-semibold text-lg mb-4 text-white">Contact</h4>
      <p>Chattogram, Bangladesh</p>
      <p>Phone: 01800000000</p>
      <p>Email: support@healthcareplus.com</p>
    </div>

    {/* Services */}
    <div>
      <h4 className="font-semibold text-lg mb-4 text-white">Services</h4>
      <ul className="space-y-2">
        <li className="hover:text-white transition-colors cursor-pointer">Appointments</li>
        <li className="hover:text-white transition-colors cursor-pointer">Doctors</li>
        <li className="hover:text-white transition-colors cursor-pointer">Lab Reports</li>
        <li className="hover:text-white transition-colors cursor-pointer">Prescriptions</li>
      </ul>
    </div>

    {/* Legal */}
    <div>
      <h4 className="font-semibold text-lg mb-4 text-white">Legal</h4>
      <ul className="space-y-2">
        <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
        <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
      </ul>
    </div>

    {/* Social */}
    <div>
      <h4 className="font-semibold text-lg mb-4 text-white">Follow Us</h4>
      <div className="flex gap-4">
        <a href="#" className="hover:text-white transition-colors"><Users className="w-6 h-6"/></a>
        <a href="#" className="hover:text-white transition-colors"><Activity className="w-6 h-6"/></a>
        <a href="#" className="hover:text-white transition-colors"><Stethoscope className="w-6 h-6"/></a>
        <a href="#" className="hover:text-white transition-colors"><FileText className="w-6 h-6"/></a>
      </div>
    </div>
  </div>

  <p className="text-center mt-12 text-gray-500">&copy; 2026 HealthCare Platform. All rights reserved.</p>
</footer>
</div> ); 
}