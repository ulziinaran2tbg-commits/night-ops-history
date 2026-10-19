'use client';

import React, { useState, useEffect } from 'react';
import { students as initialStudents, Student } from '../lib/students';

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

interface Mission {
  id: string;
  title: string;
  desc: string;
  status: 'In Progress' | 'Under Review' | 'Completed';
  comments: Comment[];
}