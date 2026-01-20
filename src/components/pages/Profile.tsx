import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { apiService } from "../../services/api";
import "../../styles/forms.css";

export const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    image: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isEditing) {
      const nameParts = user.name?.split(" ") || ["", ""];

      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "N/A",
        phone: user.phone || "",
        image: typeof user.image === "string" ? user.image : "",
        country: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: "",
      });
    }
  }, [user, isEditing]);

  if (!user) return <div className="loading">Please login first</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.firstName.trim()) {
        setError("First name is required");
        setLoading(false);
        return;
      }
      if (!formData.phone.trim()) {
        setError("Phone is required");
        setLoading(false);
        return;
      }

      const lastName = formData.lastName.trim();
      const validLastName = lastName.length >= 2 ? lastName : "N/A";

      const updatePayload: any = {
        name: {
          first: formData.firstName.trim(),
          middle: "",
          last: validLastName,
        },
        phone: formData.phone.trim(),
      };

      if (formData.image.trim()) {
        updatePayload.image = {
          url: formData.image.trim(),
          alt: `${formData.firstName} ${validLastName}`,
        };
      }

      if (formData.city.trim() || formData.street.trim()) {
        updatePayload.address = {
          state: "",
          country: formData.country.trim() || "Israel",
          city: formData.city.trim() || "Unknown",
          street: formData.street.trim() || "Unknown",
          houseNumber: formData.houseNumber ? Number(formData.houseNumber) : 1,
          zip: formData.zip ? Number(formData.zip) : 1,
        };
      }

      const updatedUser = await apiService.updateUser(user._id, updatePayload);

      setUser({
        ...user,
        name: `${formData.firstName} ${validLastName}`.trim(),
        phone: formData.phone,
        image: formData.image,
      });

      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setError("");
    } catch (err: any) {
      console.error("Update error:", err);
      const errorMessage =
        err.response?.data ||
        err.message ||
        "Failed to update profile. Please check all required fields.";
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
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>

        {success && <div className="success-message">{success}</div>}

        {!isEditing ? (
          <div className="profile-info">
            <p>
              <strong>Name:</strong> {user.name || "Not provided"}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone || "Not provided"}
            </p>
            <p>
              <strong>Account Type:</strong>{" "}
              {user.isBusiness ? "Business" : "Regular"}
            </p>
            {user.isAdmin && (
              <p>
                <strong>Role:</strong> Administrator
              </p>
            )}
            {user.address && (
              <p>
                <strong>Address:</strong> {user.address}
              </p>
            )}
            {user.image && (
              <div className="profile-image">
                <img
                  src={typeof user.image === "string" ? user.image : user.image}
                  alt={user.name}
                  style={{
                    maxWidth: "200px",
                    borderRadius: "8px",
                    marginTop: "10px",
                  }}
                />
              </div>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                minLength={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name (min 2 characters)</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Leave empty for 'N/A'"
                minLength={2}
              />
              <small
                style={{ color: "#666", marginTop: "5px", display: "block" }}
              >
                If empty or less than 2 characters, will be set to "N/A"
              </small>
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
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Israel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Tel Aviv"
              />
            </div>

            <div className="form-group">
              <label htmlFor="street">Street</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Dizengoff"
              />
            </div>

            <div className="form-group">
              <label htmlFor="houseNumber">House Number</label>
              <input
                type="number"
                id="houseNumber"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                placeholder="123"
              />
            </div>

            <div className="form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input
                type="number"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="6000000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Profile Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Saving..." : "💾 Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                  setSuccess("");
                }}
                className="btn btn-secondary"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
