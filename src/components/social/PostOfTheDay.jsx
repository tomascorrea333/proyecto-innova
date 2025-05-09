
import React from "react";
import { motion } from "framer-motion";
import { Award } from 'lucide-react';

const PostOfTheDay = ({ post }) => {
  if (!post) return null;

  return (
    <motion.div 
      className="card border-2 border-yellow-400 bg-yellow-50 p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center mb-3">
        <Award className="h-8 w-8 text-yellow-500 mr-3" />
        <h2 className="text-2xl font-bold text-yellow-700">Reflexión Destacada del Día</h2>
      </div>
      <p className="text-lg italic text-gray-700 mb-2">"{post.content.substring(0,150)}{post.content.length > 150 ? '...' : ''}"</p>
      <p className="text-right font-semibold text-gray-600">– {post.author}{post.age ? `, ${post.age} años` : ''}</p>
    </motion.div>
  );
};

export default PostOfTheDay;
