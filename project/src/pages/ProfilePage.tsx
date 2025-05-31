import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, BookOpen, Heart, Settings } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg border border-[#E53935]/20">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Info */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-[#E53935]/20 flex items-center justify-center text-[#E53935] mb-4">
                <User size={48} />
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 bg-[#E53935] text-white hover:bg-[#C62828] transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
            
            {/* User Details */}
            <div className="flex-grow">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {user.username || 'Book Lover'}
              </h1>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Mail className="text-[#E53935] mr-3" size={20} />
                  <span className="text-gray-300">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="text-[#E53935] mr-3" size={20} />
                  <span className="text-gray-300">Member since {new Date().toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#2A2A2A] p-6 rounded-md">
                  <div className="flex items-center mb-2">
                    <Heart className="text-[#E53935] mr-2" size={20} />
                    <h3 className="text-white font-semibold">Favorites</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-gray-400 text-sm">Books saved</p>
                </div>
                
                <div className="bg-[#2A2A2A] p-6 rounded-md">
                  <div className="flex items-center mb-2">
                    <BookOpen className="text-[#E53935] mr-2" size={20} />
                    <h3 className="text-white font-semibold">Reading</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-gray-400 text-sm">Books in progress</p>
                </div>
                
                <div className="bg-[#2A2A2A] p-6 rounded-md">
                  <div className="flex items-center mb-2">
                    <Settings className="text-[#E53935] mr-2" size={20} />
                    <h3 className="text-white font-semibold">Account</h3>
                  </div>
                  <p className="text-sm text-gray-400">Manage your account settings and preferences</p>
                  <button className="mt-2 text-[#E53935] hover:text-[#C62828] font-medium">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;