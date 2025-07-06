const API_BASE_URL = 'https://backend-traffic-detection-production.up.railway.app/api/v1';

class NotificationService {
  // Get notification history
  async getNotificationHistory(limit = 50) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/history?limit=${limit}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data || []
        };
      } else {
        throw new Error(data.message || 'Failed to fetch notification history');
      }
    } catch (error) {
      console.error('Error fetching notification history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get notification settings
  async getNotificationSettings() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data || []
        };
      } else {
        throw new Error(data.message || 'Failed to fetch notification settings');
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Subscribe to notifications
  async subscribeToNotifications(settings) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationType: settings.notificationType || 'sms',
          isEnabled: settings.isEnabled !== undefined ? settings.isEnabled : true,
          doNotDisturbStart: settings.doNotDisturbStart || '22:00',
          doNotDisturbEnd: settings.doNotDisturbEnd || '07:00',
          radiusKm: settings.radiusKm || 2,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data
        };
      } else {
        throw new Error(data.message || 'Failed to subscribe to notifications');
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send congestion notification
  async sendCongestionNotification(congestionClusterId, message) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/send`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          congestionClusterId,
          message,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data
        };
      } else {
        throw new Error(data.message || 'Failed to send congestion notification');
      }
    } catch (error) {
      console.error('Error sending congestion notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper method to format notification data
  formatNotificationData(apiData) {
    return apiData.map(notification => ({
      id: notification.id,
      notificationType: notification.notificationType,
      message: notification.message,
      congestionClusterId: notification.congestionClusterId,
      sentAt: notification.sentAt,
      status: notification.status,
      priority: this.getPriorityFromType(notification.notificationType),
      location: this.getLocationFromMessage(notification.message),
    }));
  }

  // Helper method to determine priority from notification type
  getPriorityFromType(type) {
    switch (type) {
      case 'traffic_alert':
      case 'community_alert':
        return 'high';
      case 'route_alert':
        return 'medium';
      default:
        return 'low';
    }
  }

  // Helper method to extract location from message
  getLocationFromMessage(message) {
    // Simple location extraction - in real app, this would be more sophisticated
    const locationKeywords = ['Central Yaoundé', 'University Area', 'Central Market', 'Business District'];
    for (const location of locationKeywords) {
      if (message.includes(location)) {
        return location;
      }
    }
    return 'Unknown Location';
  }
}

export default new NotificationService(); 