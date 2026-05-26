const supabase = require('../config/supabase');

const createAdminNotification = async (title, message, type, targetId = null) => {
  try {
     const { error } = await supabase.from('notifications').insert([{
        title,
        message, 
        type, 
        target_id: targetId,
        is_read: false
     }]);
     if(error) throw error;
  } catch (err) {
     console.error("Failed to create admin notification:", err.message);
  }
};

module.exports = { createAdminNotification };
