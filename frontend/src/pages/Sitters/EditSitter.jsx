import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditSitter = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    experience: "",
    hourlyRate: "",
    paymentLink: "",
    skills: [""],
    aboutme: "",
    facebook: "",
    instagram: "",
    isVet: false,
    verificationDocs: [],
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sitters/sitter/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch sitter details");

      const data = await res.json();
      if (data.success) {
        setForm({
          ...data.sitter,
          skills: data.sitter.skills || [""],
          verificationDocs: data.sitter.verificationDocs || [],
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading sitter details");
    }
  };

  const updateEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sitters/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        navigate("/sitterlist");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating sitter");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...form.skills];
    newSkills[index] = value;
    setForm((prev) => ({ ...prev, skills: newSkills }));
  };

  const addSkillField = () => {
    setForm((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  const removeSkillField = (index) => {
    if (form.skills.length === 1) return;
    const newSkills = form.skills.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, skills: newSkills }));
  };

  const handleVetToggle = (e) => {
    setForm((prev) => ({ ...prev, isVet: e.target.checked }));
  };

  const handleVerificationDocs = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      verificationDocs: files.map((file) => URL.createObjectURL(file)),
    }));
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6">
    <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Edit Sitter Profile
      </h1>

      <form onSubmit={updateEdit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="input-style"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="input-style"
          />
          <input
            type="text"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Years of Experience"
            className="input-style"
          />
          <input
            type="number"
            name="hourlyRate"
            value={form.hourlyRate}
            onChange={handleChange}
            placeholder="Hourly Rate ($)"
            className="input-style"
          />
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Skills</h2>
          {form.skills.map((skill, index) => (
            <div key={index} className="flex gap-4">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className="input-style"
                placeholder={`Skill ${index + 1}`}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeSkillField(index)}
                  className="btn-danger"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSkillField} className="btn-primary">
            + Add Skill
          </button>
        </div>

        {/* Vet Verification */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.isVet}
            onChange={handleVetToggle}
            className="h-5 w-5 text-blue-600 rounded focus:ring focus:ring-blue-300"
          />
          <label className="text-gray-700">Are you a Vet?</label>
        </div>
        {form.isVet && (
          <div>
            <label className="block text-gray-700 font-medium">Upload Verification Documents</label>
            <input type="file" multiple onChange={handleVerificationDocs} className="mt-2 input-style" />
          </div>
        )}

        {/* Social & Payment Links */}
        <div className="space-y-4">
          <label className="text-gray-700 font-medium">Social & Payment Links</label>
          <input
            type="url"
            name="paymentLink"
            value={form.paymentLink}
            onChange={handleChange}
            placeholder="Payment Link"
            className="input-style"
          />
          <input
            type="url"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            placeholder="Facebook Profile"
            className="input-style"
          />
          <input
            type="url"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="Instagram Profile"
            className="input-style"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-success w-full">
          Save Changes
        </button>
      </form>
    </div>
  </div>
  );
};

export default EditSitter;
