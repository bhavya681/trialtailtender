import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterSitter = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    experience: '',
    hourlyRate: '',
    paymentLink: '',
    skills: [''],
    aboutme: '',
    facebook: '',
    instagram: '',
    isVet: false,
    verificationDocs: [],
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email format';
    if (!form.experience) newErrors.experience = 'Experience is required';
    if (!form.hourlyRate) newErrors.hourlyRate = 'Hourly rate is required';
    if (!form.paymentLink.trim()) newErrors.paymentLink = 'Payment link is required';
    if (!form.aboutme.trim()) newErrors.aboutme = 'About Me section is required';
    if (form.isVet && form.verificationDocs.length === 0) {
      newErrors.verificationDocs = 'Vet verification documents are required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sitters/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Sitter registered successfully!');
        navigate('/sitterlist');
      } else {
        toast.error(data.message || 'Registration failed.');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...form.skills];
    newSkills[index] = value;
    setForm((prev) => ({ ...prev, skills: newSkills }));
  };

  const addSkillField = () => {
    setForm((prev) => ({ ...prev, skills: [...prev.skills, ''] }));
  };

  const removeSkillField = (index) => {
    if (form.skills.length === 1) return;
    setForm((prev) => ({ ...prev, skills: form.skills.filter((_, i) => i !== index) }));
  };

  const handleVetChange = () => {
    setForm((prev) => ({ ...prev, isVet: !prev.isVet, verificationDocs: !prev.isVet ? [] : prev.verificationDocs }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, verificationDocs: files }));
  };

  return (
    <div className="container mx-auto p-6 mt-[80px]">
      <h1 className="text-3xl font-semibold mb-6">Register as a Sitter</h1>

      <form onSubmit={submitCreate} className="space-y-6">
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block font-medium">Experience (Years)</label>
          <input
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.experience && <p className="text-red-500">{errors.experience}</p>}
        </div>

        <div>
          <label className="block font-medium">Hourly Rate ($)</label>
          <input
            type="number"
            name="hourlyRate"
            value={form.hourlyRate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.hourlyRate && <p className="text-red-500">{errors.hourlyRate}</p>}
        </div>

        <div>
          <label className="block font-medium">Payment Link</label>
          <input
            type="text"
            name="paymentLink"
            value={form.paymentLink}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.paymentLink && <p className="text-red-500">{errors.paymentLink}</p>}
        </div>


        <div>
          <label className="block font-medium">Instagram Link</label>
          <input
            type="text"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.instagram && <p className="text-red-500">{errors.instagram}</p>}
        </div>

        <div>
          <label className="block font-medium">Facebook Link</label>
          <input
            type="text"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.facebook && <p className="text-red-500">{errors.facebook}</p>}
        </div>

        <div>
          <label className="block font-medium">Skills</label>
          {form.skills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              {index > 0 && (
                <button type="button" onClick={() => removeSkillField(index)} className="text-red-500">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSkillField} className="text-blue-500">
            + Add Skill
          </button>
        </div>

        <div>
          <label className="block font-medium">About Me</label>
          <textarea
            name="aboutme"
            value={form.aboutme}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
          {errors.aboutme && <p className="text-red-500">{errors.aboutme}</p>}
        </div>

        <div>
          <input type="checkbox" checked={form.isVet} onChange={handleVetChange} /> <span>Are you a vet?</span>
        </div>

        {form.isVet && (
          <div>
            <label className="block font-medium">Vet Verification Documents</label>
            <input type="file" multiple onChange={handleFileChange} />
            {errors.verificationDocs && <p className="text-red-500">{errors.verificationDocs}</p>}
          </div>
        )}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterSitter;
