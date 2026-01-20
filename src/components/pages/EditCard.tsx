import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../types";
import { apiService } from "../../services/api";
import "../../styles/forms.css";

export const EditCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    image: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
    bizNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        if (id) {
          const data = await apiService.getCardById(id);

          // Парсим данные карточки
          const imageUrl =
            typeof data.image === "string" ? data.image : data.image?.url || "";

          let addressData = {
            country: "",
            city: "",
            street: "",
            houseNumber: "",
            zip: "",
          };

          if (typeof data.address === "object" && data.address) {
            addressData = {
              country: data.address.country || "",
              city: data.address.city || "",
              street: data.address.street || "",
              houseNumber: String(data.address.houseNumber || ""),
              zip: String(data.address.zip || ""),
            };
          }

          setFormData({
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            phone: data.phone,
            email: data.email,
            web: data.web,
            image: imageUrl,
            ...addressData,
            bizNumber: String(data.bizNumber),
          });
        }
      } catch (err: any) {
        setError("Error loading card: " + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await apiService.updateCard(id, {
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

      setSuccessMessage("Card updated successfully! Redirecting...");
      setTimeout(() => {
        navigate("/my-cards");
      }, 1500);
    } catch (err: any) {
      const errorMessage =
        err.response?.data || err.message || "Error updating card";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading card...</div>;
  if (error && !formData.title) return <div className="error">{error}</div>;

  return (
    <div className="form-page">
      <div className="form-container">
        <h1>✏️ Edit Business Card</h1>

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
            />
          </div>

          <div className="form-group">
            <label htmlFor="bizNumber">Business Number *</label>
            <input
              type="number"
              id="bizNumber"
              name="bizNumber"
              value={formData.bizNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "⏳ Updating..." : "💾 Update Card"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/my-cards")}
              className="btn btn-secondary"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
