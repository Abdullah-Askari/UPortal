import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../context/useTheme';

const PullRequests = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // GitHub repository configuration
  const GITHUB_OWNER = 'Abdullah-Askari';
  const GITHUB_REPO = 'UPortal';
  
  const fetchPullRequests = async () => {
    try {
      setError(null);
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls?state=open&sort=updated&direction=desc`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      setPullRequests(data);
    } catch (err) {
      console.error('Error fetching pull requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchPullRequests();
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchPullRequests();
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };
  
  const getStatusColor = (state, draft) => {
    if (draft) return '#6B7280';
    if (state === 'open') return '#10B981';
    return '#EF4444';
  };
  
  const getStatusText = (state, draft) => {
    if (draft) return 'Draft';
    if (state === 'open') return 'Open';
    return 'Closed';
  };
  
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center h-20 px-4 gap-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
          </Pressable>
          <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>
            Pull Requests
          </Text>
          <Pressable className="p-2" onPress={onRefresh} disabled={refreshing}>
            <Ionicons 
              name="refresh" 
              size={24} 
              color={theme.textInverse} 
              style={{ opacity: refreshing ? 0.5 : 1 }}
            />
          </Pressable>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView 
        className="flex-1" 
        style={{ backgroundColor: theme.background }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View className="flex-1 items-center justify-center p-12">
            <ActivityIndicator size="large" color={theme.primary} />
            <Text className="text-center mt-4" style={{ color: theme.textSecondary }}>
              Loading pull requests...
            </Text>
          </View>
        ) : error ? (
          <View className="p-6">
            <View className="rounded-xl p-6 items-center" style={{ backgroundColor: theme.surface }}>
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text className="text-lg font-semibold mt-4 text-center" style={{ color: theme.text }}>
                Error Loading Pull Requests
              </Text>
              <Text className="text-center mt-2" style={{ color: theme.textSecondary }}>
                {error}
              </Text>
              <TouchableOpacity
                onPress={onRefresh}
                className="mt-4 px-6 py-3 rounded-lg"
                style={{ backgroundColor: theme.primary }}
              >
                <Text className="font-semibold" style={{ color: theme.textInverse }}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : pullRequests.length === 0 ? (
          <View className="p-6">
            <View className="rounded-xl p-6 items-center" style={{ backgroundColor: theme.surface }}>
              <Ionicons name="git-pull-request-outline" size={48} color={theme.textSecondary} />
              <Text className="text-lg font-semibold mt-4" style={{ color: theme.text }}>
                No Open Pull Requests
              </Text>
              <Text className="text-center mt-2" style={{ color: theme.textSecondary }}>
                There are currently no open pull requests in this repository.
              </Text>
            </View>
          </View>
        ) : (
          <View className="p-6">
            <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
              Open Pull Requests ({pullRequests.length})
            </Text>
            <View className="gap-3">
              {pullRequests.map((pr) => (
                <TouchableOpacity
                  key={pr.id}
                  className="rounded-xl p-4 shadow-sm"
                  style={{ backgroundColor: theme.surface }}
                  onPress={() => {
                    // Open PR in browser or show details
                    console.log('Selected PR:', pr.html_url);
                  }}
                  activeOpacity={0.7}
                >
                  {/* PR Header */}
                  <View className="flex-row items-start gap-3">
                    <View 
                      className="w-10 h-10 rounded-lg items-center justify-center"
                      style={{ backgroundColor: `${getStatusColor(pr.state, pr.draft)}20` }}
                    >
                      <Ionicons 
                        name="git-pull-request" 
                        size={20} 
                        color={getStatusColor(pr.state, pr.draft)} 
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text 
                          className="text-xs font-semibold px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: `${getStatusColor(pr.state, pr.draft)}20`,
                            color: getStatusColor(pr.state, pr.draft)
                          }}
                        >
                          {getStatusText(pr.state, pr.draft)}
                        </Text>
                        <Text className="text-xs" style={{ color: theme.textTertiary }}>
                          #{pr.number}
                        </Text>
                      </View>
                      <Text className="text-base font-semibold mb-1" style={{ color: theme.text }}>
                        {pr.title}
                      </Text>
                      <Text className="text-sm mb-2" style={{ color: theme.textSecondary }}>
                        {pr.user.login} • {formatDate(pr.updated_at)}
                      </Text>
                      
                      {/* PR Details */}
                      <View className="flex-row items-center gap-4 mt-2">
                        {pr.comments > 0 && (
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="chatbox-outline" size={14} color={theme.textTertiary} />
                            <Text className="text-xs" style={{ color: theme.textTertiary }}>
                              {pr.comments}
                            </Text>
                          </View>
                        )}
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="git-branch-outline" size={14} color={theme.textTertiary} />
                          <Text className="text-xs" style={{ color: theme.textTertiary }}>
                            {pr.head.ref}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PullRequests;
