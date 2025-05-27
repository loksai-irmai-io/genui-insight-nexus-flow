
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserPreference {
  id: string;
  widget_id: string;
  widget_name: string;
  selected_module: string | null;
  saved_at: string;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_widget_preferences')
        .select(`
          id,
          widget_id,
          selected_module,
          saved_at,
          widgets:widget_id (
            widget_name
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedPreferences = data?.map(pref => ({
        id: pref.id,
        widget_id: pref.widget_id,
        widget_name: pref.widgets?.widget_name || '',
        selected_module: pref.selected_module,
        saved_at: pref.saved_at,
      })) || [];

      setPreferences(formattedPreferences);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      toast.error('Failed to load your preferences');
    } finally {
      setLoading(false);
    }
  };

  const saveWidgetPreference = async (widgetName: string, selectedModule: string) => {
    if (!user) return;

    try {
      // First get the widget ID
      const { data: widget, error: widgetError } = await supabase
        .from('widgets')
        .select('id')
        .eq('widget_name', widgetName)
        .single();

      if (widgetError) throw widgetError;

      // Save or update preference
      const { error } = await supabase
        .from('user_widget_preferences')
        .upsert({
          user_id: user.id,
          widget_id: widget.id,
          selected_module: selectedModule,
        });

      if (error) throw error;

      toast.success('Widget preference saved');
      await fetchPreferences();
    } catch (error) {
      console.error('Error saving widget preference:', error);
      toast.error('Failed to save widget preference');
    }
  };

  const removeWidgetPreference = async (widgetName: string, selectedModule?: string) => {
    if (!user) return;

    try {
      let query = supabase
        .from('user_widget_preferences')
        .delete()
        .eq('user_id', user.id);

      // Get widget ID first
      const { data: widget } = await supabase
        .from('widgets')
        .select('id')
        .eq('widget_name', widgetName)
        .single();

      if (widget) {
        query = query.eq('widget_id', widget.id);
        
        if (selectedModule) {
          query = query.eq('selected_module', selectedModule);
        }
      }

      const { error } = await query;
      if (error) throw error;

      toast.success('Widget preference removed');
      await fetchPreferences();
    } catch (error) {
      console.error('Error removing widget preference:', error);
      toast.error('Failed to remove widget preference');
    }
  };

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setPreferences([]);
    }
  }, [user]);

  return {
    preferences,
    loading,
    saveWidgetPreference,
    removeWidgetPreference,
    refreshPreferences: fetchPreferences,
  };
};
