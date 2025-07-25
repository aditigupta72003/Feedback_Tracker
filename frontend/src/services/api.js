const API_BASE_URL = 'http://localhost:3001';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

export const feedbackApi = {
  getAllFeedback: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`);
      return handleResponse(response);
    } catch (error) {
      console.error('API Error - getAllFeedback:', error);
      throw error;
    }
  },

  createFeedback: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error - createFeedback:', error);
      throw error;
    }
  },

  voteFeedback: async (id, action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${id}/vote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error - voteFeedback:', error);
      throw error;
    }
  },

  deleteFeedback: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'DELETE',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error - deleteFeedback:', error);
      throw error;
    }
  }
};