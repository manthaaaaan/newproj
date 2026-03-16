export interface District {
  name: string;
  lat: number;
  lng: number;
}

export interface State {
  name: string;
  districts: District[];
}

export const indianStates: State[] = [
  {
    name: 'Andhra Pradesh',
    districts: [
      { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
      { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
      { name: 'Guntur', lat: 16.3067, lng: 80.4365 },
      { name: 'Tirupati', lat: 13.6288, lng: 79.4192 }
    ]
  },
  {
    name: 'Arunachal Pradesh',
    districts: [
      { name: 'Itanagar', lat: 27.0844, lng: 93.6053 },
      { name: 'Tawang', lat: 27.5851, lng: 91.8596 }
    ]
  },
  {
    name: 'Assam',
    districts: [
      { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
      { name: 'Dibrugarh', lat: 27.4728, lng: 94.9120 },
      { name: 'Silchar', lat: 24.8333, lng: 92.7789 }
    ]
  },
  {
    name: 'Bihar',
    districts: [
      { name: 'Patna', lat: 25.5941, lng: 85.1376 },
      { name: 'Gaya', lat: 24.7914, lng: 85.0002 },
      { name: 'Bhagalpur', lat: 25.2425, lng: 86.9718 }
    ]
  },
  {
    name: 'Chhattisgarh',
    districts: [
      { name: 'Raipur', lat: 21.2514, lng: 81.6296 },
      { name: 'Bhilai', lat: 21.1938, lng: 81.3509 },
      { name: 'Bilaspur', lat: 22.0774, lng: 82.1399 }
    ]
  },
  {
    name: 'Goa',
    districts: [
      { name: 'Panaji', lat: 15.4909, lng: 73.8278 },
      { name: 'Margao', lat: 15.2832, lng: 73.9862 }
    ]
  },
  {
    name: 'Gujarat',
    districts: [
      { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
      { name: 'Surat', lat: 21.1702, lng: 72.8311 },
      { name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
      { name: 'Rajkot', lat: 22.3039, lng: 70.8022 }
    ]
  },
  {
    name: 'Haryana',
    districts: [
      { name: 'Gurugram', lat: 28.4595, lng: 77.0266 },
      { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
      { name: 'Panipat', lat: 29.3909, lng: 76.9635 }
    ]
  },
  {
    name: 'Himachal Pradesh',
    districts: [
      { name: 'Shimla', lat: 31.1048, lng: 77.1734 },
      { name: 'Manali', lat: 32.2432, lng: 77.1892 },
      { name: 'Dharamshala', lat: 32.2190, lng: 76.3234 }
    ]
  },
  {
    name: 'Jharkhand',
    districts: [
      { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
      { name: 'Jamshedpur', lat: 22.8046, lng: 86.2029 },
      { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 }
    ]
  },
  {
    name: 'Karnataka',
    districts: [
      { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
      { name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
      { name: 'Mangaluru', lat: 12.9141, lng: 74.8560 },
      { name: 'Hubballi', lat: 15.3647, lng: 75.1240 }
    ]
  },
  {
    name: 'Kerala',
    districts: [
      { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
      { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
      { name: 'Kozhikode', lat: 11.2588, lng: 75.7804 }
    ]
  },
  {
    name: 'Madhya Pradesh',
    districts: [
      { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
      { name: 'Indore', lat: 22.7196, lng: 75.8577 },
      { name: 'Gwalior', lat: 26.2183, lng: 78.1828 },
      { name: 'Jabalpur', lat: 23.1815, lng: 79.9864 }
    ]
  },
  {
    name: 'Maharashtra',
    districts: [
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
      { name: 'Pune', lat: 18.5204, lng: 73.8567 },
      { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
      { name: 'Nashik', lat: 19.9975, lng: 73.7898 }
    ]
  },
  {
    name: 'Manipur',
    districts: [
      { name: 'Imphal', lat: 24.8170, lng: 93.9368 }
    ]
  },
  {
    name: 'Meghalaya',
    districts: [
      { name: 'Shillong', lat: 25.5788, lng: 91.8831 }
    ]
  },
  {
    name: 'Mizoram',
    districts: [
      { name: 'Aizawl', lat: 23.7271, lng: 92.7176 }
    ]
  },
  {
    name: 'Nagaland',
    districts: [
      { name: 'Kohima', lat: 25.6751, lng: 94.1086 },
      { name: 'Dimapur', lat: 25.9061, lng: 93.7270 }
    ]
  },
  {
    name: 'Odisha',
    districts: [
      { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
      { name: 'Cuttack', lat: 20.4625, lng: 85.8830 },
      { name: 'Rourkela', lat: 22.2604, lng: 84.8536 }
    ]
  },
  {
    name: 'Punjab',
    districts: [
      { name: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
      { name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
      { name: 'Jalandhar', lat: 31.3260, lng: 75.5762 }
    ]
  },
  {
    name: 'Rajasthan',
    districts: [
      { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
      { name: 'Jodhpur', lat: 26.2389, lng: 73.0243 },
      { name: 'Udaipur', lat: 24.5854, lng: 73.7125 },
      { name: 'Kota', lat: 25.2138, lng: 75.8648 }
    ]
  },
  {
    name: 'Sikkim',
    districts: [
      { name: 'Gangtok', lat: 27.3314, lng: 88.6138 }
    ]
  },
  {
    name: 'Tamil Nadu',
    districts: [
      { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
      { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
      { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
      { name: 'Salem', lat: 11.6643, lng: 78.1460 }
    ]
  },
  {
    name: 'Telangana',
    districts: [
      { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
      { name: 'Warangal', lat: 17.9689, lng: 79.5941 },
      { name: 'Nizamabad', lat: 18.6725, lng: 78.0941 }
    ]
  },
  {
    name: 'Tripura',
    districts: [
      { name: 'Agartala', lat: 23.8315, lng: 91.2868 }
    ]
  },
  {
    name: 'Uttar Pradesh',
    districts: [
      { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
      { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
      { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
      { name: 'Agra', lat: 27.1767, lng: 78.0081 },
      { name: 'Meerut', lat: 28.9845, lng: 77.7064 },
      { name: 'Noida', lat: 28.5355, lng: 77.3910 }
    ]
  },
  {
    name: 'Uttarakhand',
    districts: [
      { name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
      { name: 'Haridwar', lat: 29.9457, lng: 78.1642 },
      { name: 'Nainital', lat: 29.3803, lng: 79.4636 }
    ]
  },
  {
    name: 'West Bengal',
    districts: [
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
      { name: 'Asansol', lat: 23.6739, lng: 86.9524 },
      { name: 'Siliguri', lat: 26.7271, lng: 88.3953 },
      { name: 'Durgapur', lat: 23.4846, lng: 87.3213 }
    ]
  },
  {
    name: 'Andaman and Nicobar',
    districts: [
      { name: 'Port Blair', lat: 11.6234, lng: 92.7265 }
    ]
  },
  {
    name: 'Chandigarh',
    districts: [
      { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 }
    ]
  },
  {
    name: 'Dadra and Nagar Haveli',
    districts: [
      { name: 'Silvassa', lat: 20.2765, lng: 73.0032 }
    ]
  },
  {
    name: 'Daman and Diu',
    districts: [
      { name: 'Daman', lat: 20.3974, lng: 72.8328 },
      { name: 'Diu', lat: 20.7144, lng: 70.9874 }
    ]
  },
  {
    name: 'Delhi',
    districts: [
      { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
      { name: 'North Delhi', lat: 28.7500, lng: 77.1167 },
      { name: 'South Delhi', lat: 28.5200, lng: 77.2100 },
      { name: 'East Delhi', lat: 28.6300, lng: 77.2900 },
      { name: 'West Delhi', lat: 28.6700, lng: 77.0700 },
      { name: 'Dwarka', lat: 28.5823, lng: 77.0500 },
      { name: 'Rohini', lat: 28.7041, lng: 77.1025 }
    ]
  },
  {
    name: 'Jammu and Kashmir',
    districts: [
      { name: 'Srinagar', lat: 34.0837, lng: 74.7973 },
      { name: 'Jammu', lat: 32.7266, lng: 74.8570 }
    ]
  },
  {
    name: 'Ladakh',
    districts: [
      { name: 'Leh', lat: 34.1526, lng: 77.5771 },
      { name: 'Kargil', lat: 34.5539, lng: 76.1349 }
    ]
  },
  {
    name: 'Lakshadweep',
    districts: [
      { name: 'Kavaratti', lat: 10.5667, lng: 72.6417 }
    ]
  },
  {
    name: 'Puducherry',
    districts: [
      { name: 'Puducherry', lat: 11.9416, lng: 79.8083 }
    ]
  }
];
