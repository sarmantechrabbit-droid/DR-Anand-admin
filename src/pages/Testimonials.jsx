import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Eye,
  Trash2,
  Plus,
  X,
  Edit,
  Play,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import DeleteConfirmation from "../components/ui/DeleteConfirmation";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE, API_URLS } from "../config/api";

const API_URL = API_URLS.TESTIMONIALS;
const TESTIMONIAL_STATUS = {
  PENDING: "Pending",
  PUBLISHED: "Published",
};

const Testimonials = () => {
  const TESTIMONIAL_LIMITS = {
    patientMin: 3,
    patientMax: 50,
    commentMax: 500,
  };
  const [filter, setFilter] = useState("All");
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    patient: "",
    rating: 5,
    comment: "",
    status: TESTIMONIAL_STATUS.PENDING,
    imageFile: null,
    imagePreview: null,
    youtubeLink: "",
  });
  const [formError, setFormError] = useState("");

  const normalizeStatus = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    if (["published", "approve", "approved", "active"].includes(normalized)) {
      return TESTIMONIAL_STATUS.PUBLISHED;
    }
    return TESTIMONIAL_STATUS.PENDING;
  };

  const toApiStatus = (value) =>
    normalizeStatus(value) === TESTIMONIAL_STATUS.PUBLISHED
      ? TESTIMONIAL_STATUS.PUBLISHED
      : TESTIMONIAL_STATUS.PENDING;

  const toIsPublished = (value) => normalizeStatus(value) === TESTIMONIAL_STATUS.PUBLISHED;
  const toFormBoolean = (value) => (value ? "true" : "");

  const resolveImageUrl = (value) => {
    if (!value) return null;
    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("data:")
    ) {
      return value;
    }
    return `${API_BASE}/uploads/${value}`;
  };

  const normalizeYoutubeLink = (value) => {
    return (value || "").trim();
  };

  const isValidYoutubeWatchUrl = (value) => {
    const raw = (value || "").trim();
    if (!raw) return true;

    try {
      const parsed = new URL(raw);
      if (parsed.protocol !== "https:") return false;
      if (parsed.hostname !== "www.youtube.com") return false;
      if (parsed.pathname !== "/watch") return false;

      const videoId = parsed.searchParams.get("v");
      if (!videoId) return false;

      return /^[A-Za-z0-9_-]{11}$/.test(videoId);
    } catch {
      return false;
    }
  };

  const normalizeTestimonial = (item) => ({
    id: item.id || item._id,
    patient: item.patient || item.name || "",
    rating: Number(item.rating) || 5,
    date: (item.date || item.createdAt || "").toString().slice(0, 10),
    status: normalizeStatus(item.status),
    comment: item.comment || item.review || item.message || "",
    likes: Number(item.likes) || 0,
    image: resolveImageUrl(item.image || item.avatar || item.photo),
    youtubeLink: item.youtubeLink || item.videoUrl || "",
  });

  const updateTestimonialById = async (id, payloadFactory, config = {}) => {
    try {
      await axios.put(`${API_URL}/${id}`, payloadFactory(), config);
    } catch (putError) {
      await axios.patch(`${API_URL}/${id}`, payloadFactory(), config);
    }
  };

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { data } = await axios.get(API_URL);
      const list = Array.isArray(data)
        ? data
        : data?.testimonials || data?.data || data?.items || data?.results || [];
      setTestimonials(list.map(normalizeTestimonial));
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "Unable to load testimonials",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const resetForm = () => {
    setFormData({
      patient: "",
      rating: 5,
      comment: "",
      status: TESTIMONIAL_STATUS.PENDING,
      imageFile: null,
      imagePreview: null,
      youtubeLink: "",
    });
    setEditItem(null);
    setFormError("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError("");
    setErrorMessage("");

    const patient = formData.patient.trim();
    const comment = formData.comment.trim();
    const rating = Number(formData.rating);

    if (!patient) {
      setFormError("Patient name is required.");
      return;
    }

    if (patient.length < TESTIMONIAL_LIMITS.patientMin) {
      setFormError(
        `Patient name must be at least ${TESTIMONIAL_LIMITS.patientMin} characters.`,
      );
      return;
    }

    if (patient.length > TESTIMONIAL_LIMITS.patientMax) {
      setFormError(
        `Patient name cannot be more than ${TESTIMONIAL_LIMITS.patientMax} characters.`,
      );
      return;
    }

    if (!comment) {
      setFormError("Comment is required.");
      return;
    }

    if (comment.length < 10) {
      setFormError("Comment must be at least 10 characters.");
      return;
    }

    if (comment.length > TESTIMONIAL_LIMITS.commentMax) {
      setFormError(
        `Comment cannot be more than ${TESTIMONIAL_LIMITS.commentMax} characters.`,
      );
      return;
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setFormError("Rating must be between 1 and 5.");
      return;
    }

    if (!editItem?.id && !formData.imageFile) {
      setFormError("Patient image is required.");
      return;
    }

    const normalizedYoutubeLink = normalizeYoutubeLink(formData.youtubeLink);
    if (!isValidYoutubeWatchUrl(normalizedYoutubeLink)) {
      setFormError(
        "Invalid YouTube URL. Use this format: https://www.youtube.com/watch?v=VIDEO_ID",
      );
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        patient,
        rating,
        comment,
        status: normalizeStatus(formData.status),
        apiStatus: toApiStatus(formData.status),
        isPublished: toIsPublished(formData.status),
        youtubeLink: normalizedYoutubeLink,
        imageFile: formData.imageFile,
      };

      const buildMultipartPayload = () => {
        const body = new FormData();
        body.append("patient", payload.patient);
        body.append("rating", String(payload.rating));
        body.append("comment", payload.comment);
        body.append("status", payload.apiStatus);
        body.append("isPublished", toFormBoolean(payload.isPublished));
        body.append("published", toFormBoolean(payload.isPublished));
        body.append("approved", toFormBoolean(payload.isPublished));
        if (payload.youtubeLink) {
          body.append("youtubeLink", payload.youtubeLink);
        }
        if (payload.imageFile) {
          body.append("image", payload.imageFile);
        }
        return body;
      };

      if (editItem?.id) {
        await updateTestimonialById(editItem.id, buildMultipartPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API_URL, buildMultipartPayload(), {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchTestimonials();
      resetForm();
      setShowPopup(false);
    } catch (error) {
      setFormError(error.response?.data?.message || error.message || "Unable to save testimonial");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      patient: item.patient,
      rating: item.rating,
      comment: item.comment,
      status: normalizeStatus(item.status),
      imageFile: null,
      imagePreview: item.image || null,
      youtubeLink: item.youtubeLink || "",
    });
    setFormError("");
    setShowPopup(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setErrorMessage("");

    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      await fetchTestimonials();
      setShowDeletePopup(false);
      setDeleteId(null);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "Unable to delete testimonial",
      );
    }
  };

  const handleView = (item) => {
    setViewItem(item);
    setShowViewPopup(true);
  };

  const handlePublish = async (id) => {
    setErrorMessage("");
    try {
      await updateTestimonialById(id, () => ({
        status: TESTIMONIAL_STATUS.PUBLISHED,
        isPublished: true,
        published: true,
        approved: true,
      }));
      await fetchTestimonials();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "Unable to publish testimonial",
      );
    }
  };

  const filteredTestimonials =
    filter === "All"
      ? testimonials
      : testimonials.filter((t) => t.status === filter);

  const averageRating = testimonials.length
    ? (
        testimonials.reduce((sum, t) => sum + (Number(t.rating) || 0), 0) /
        testimonials.length
      ).toFixed(1)
    : "0.0";

  const stats = [
    {
      label: "Total Reviews",
      value: testimonials.length,
      icon: MessageSquare,
      color: "bg-primary-500",
    },
    {
      label: "Average Rating",
      value: averageRating,
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      label: "Published",
      value: testimonials.filter((t) => t.status === "Published").length,
      icon: Eye,
      color: "bg-green-500",
    },
    {
      label: "Total Likes",
      value: testimonials.reduce((sum, t) => sum + (Number(t.likes) || 0), 0),
      icon: ThumbsUp,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
          <p className="text-gray-600 mt-1">
            Manage patient reviews and feedback
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            resetForm();
            setShowPopup(true);
          }}
        >
          Add Testimonial
        </Button>
      </motion.div>

      {errorMessage && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 border border-blue-200">
          Loading testimonials...
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow"
          >
            <div
              className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-2"
      >
        {["All", "Published", "Pending"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === status
                ? "bg-primary-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {status}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {testimonial.image ? (
                      testimonial.youtubeLink ? (
                        <a
                          href={testimonial.youtubeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="relative w-12 h-12 rounded-full overflow-hidden group"
                          title="Play testimonial video"
                        >
                          <img
                            src={testimonial.image}
                            alt={testimonial.patient}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <span className="absolute inset-0 bg-black/35 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </span>
                        </a>
                      ) : (
                        <img
                          src={testimonial.image}
                          alt={testimonial.patient}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )
                    ) : (
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {testimonial.patient?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {testimonial.patient}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.date}
                      </p>
                    </div>
                  </div>
                  <Badge
                    status={
                      testimonial.status === TESTIMONIAL_STATUS.PUBLISHED
                        ? "Confirmed"
                        : "Pending"
                    }
                  >
                    {testimonial.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {testimonial.rating}.0
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {testimonial.comment}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{testimonial.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {testimonial.status === TESTIMONIAL_STATUS.PENDING && (
                      <Button
                        size="sm"
                        onClick={() => handlePublish(testimonial.id)}
                      >
                        Publish
                      </Button>
                    )}
                    <button
                      onClick={() => handleView(testimonial)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-400 hover:text-primary-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(testimonial.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {!isLoading && filteredTestimonials.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No testimonials found
            </h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters</p>
          </div>
        </Card>
      )}

      <AnimatePresence>
        {showPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowPopup(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editItem ? "Edit" : "Add New"} Testimonial
                  </h2>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <form onSubmit={handleAdd} className="p-6 space-y-4">
                  {formError && (
                    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                      {formError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editItem && !formData.imagePreview}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {formData.imagePreview && (
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="mt-3 w-20 h-20 rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      value={formData.patient}
                      onChange={(e) =>
                        setFormData({ ...formData, patient: e.target.value })
                      }
                      maxLength={TESTIMONIAL_LIMITS.patientMax}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      rows="4"
                      maxLength={TESTIMONIAL_LIMITS.commentMax}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option>{TESTIMONIAL_STATUS.PENDING}</option>
                      <option>{TESTIMONIAL_STATUS.PUBLISHED}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube Link
                    </label>
                    <input
                      type="text"
                      inputMode="url"
                      value={formData.youtubeLink}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          youtubeLink: e.target.value,
                        })
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving
                        ? "Saving..."
                        : `${editItem ? "Update" : "Add"} Testimonial`}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowPopup(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showViewPopup && viewItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowViewPopup(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">
                    Testimonial Details
                  </h2>
                  <button
                    onClick={() => setShowViewPopup(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    {viewItem.image ? (
                      viewItem.youtubeLink ? (
                        <a
                          href={viewItem.youtubeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="relative w-16 h-16 rounded-full overflow-hidden"
                          title="Play testimonial video"
                        >
                          <img
                            src={viewItem.image}
                            alt={viewItem.patient}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <span className="absolute inset-0 bg-black/35 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-white" />
                          </span>
                        </a>
                      ) : (
                        <img
                          src={viewItem.image}
                          alt={viewItem.patient}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )
                    ) : (
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-bold text-xl">
                          {viewItem.patient?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {viewItem.patient}
                      </h3>
                      <p className="text-gray-600">{viewItem.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i < viewItem.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-lg font-semibold text-gray-800">
                      {viewItem.rating}.0
                    </span>
                  </div>
                  <div>
                    <Badge
                      status={
                        viewItem.status === TESTIMONIAL_STATUS.PUBLISHED
                          ? "Confirmed"
                          : "Pending"
                      }
                    >
                      {viewItem.status}
                    </Badge>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                      {viewItem.comment}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 pt-4 border-t border-gray-100">
                    <ThumbsUp className="w-5 h-5" />
                    <span>{viewItem.likes} likes</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <DeleteConfirmation
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </div>
  );
};

export default Testimonials;
