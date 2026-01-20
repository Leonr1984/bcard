import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/api";
import "../../styles/forms.css";

export const CreateCard: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    image: "",
    country: "Israel",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
    bizNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      console.log("=== CREATE CARD START ===");
      console.log("Form data:", formData);

      const result = await apiService.createCard({
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        description: formData.description.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        web: formData.web.trim(),
        image: formData.image.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        street: formData.street.trim(),
        houseNumber: formData.houseNumber,
        zip: formData.zip,
        bizNumber: formData.bizNumber,
      });

      console.log("Card created successfully:", result);
      setSuccessMessage("Card created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/my-cards");
      }, 1500);
    } catch (err: any) {
      console.error("=== CREATE CARD ERROR ===");
      console.error("Full error:", err);
      console.error("Response status:", err.response?.status);
      console.error("Response data:", err.response?.data);

      const errorMessage =
        err.response?.data ||
        err.message ||
        "Error creating card. Please check all fields.";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h1>➕ Create Business Card</h1>

        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Business Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Your business name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subtitle">Subtitle *</label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              required
              placeholder="Your profession"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your business"
              rows={5}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="050-1234567"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="business@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="web">Website *</label>
            <input
              type="url"
              id="web"
              name="web"
              value={formData.web}
              onChange={handleChange}
              required
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL *</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <h3 style={{ marginTop: "20px", marginBottom: "15px" }}>
            Address Information
          </h3>

          <div className="form-group">
            <label htmlFor="country">Country *</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Tel Aviv"
            />
          </div>

          <div className="form-group">
            <label htmlFor="street">Street *</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
              placeholder="Dizengoff"
            />
          </div>

          <div className="form-group">
            <label htmlFor="houseNumber">House Number *</label>
            <input
              type="number"
              id="houseNumber"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              required
              placeholder="123"
            />
          </div>

          <div className="form-group">
            <label htmlFor="zip">ZIP Code *</label>
            <input
              type="number"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              placeholder="6000000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bizNumber">Business Number (optional)</label>
            <input
              type="number"
              id="bizNumber"
              name="bizNumber"
              value={formData.bizNumber}
              onChange={handleChange}
              placeholder="Leave empty to auto-generate"
            />
            <small
              style={{ color: "#666", marginTop: "5px", display: "block" }}
            >
              If not provided, a random number will be generated
            </small>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "⏳ Creating..." : "✅ Create Card"}
          </button>
        </form>
      </div>
    </div>
  );
};
