'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from '@/contexts/SidebarContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { useToast } from '@/components/ui/Toast';
import { MenuItem } from '@/types/layout';

// Routes that are implemented
const implementedRoutes = ['/tasks/list', '/tasks/new', '/tasks/detail', '/tasks/', '/tasks/messages', '/tasks/todo', '/tasks/library', '/tasks/info', '/tasks/store-info', '/tasks/report'];

// Menu items configuration with parent-child structure
export const menuItems: MenuItem[] = [
  {
    id: 'hq-store',
    label: 'Task list HQ-Store',
    icon: 'gg-list',
    route: '/tasks',
    children: [
      {
        id: 'list-task',
        label: 'List task',
        icon: 'task-daily',
        route: '/tasks/list',
      },
      {
        id: 'detail',
        label: 'Detail',
        icon: 'task-pin',
        route: '/tasks/detail',
      },
      {
        id: 'message',
        label: 'Message',
        icon: 'message',
        route: '/tasks/messages',
      },
    ],
  },
  {
    id: 'todo',
    label: 'To-do Task',
    icon: 'task-edit',
    route: '/tasks/todo',
  },
  {
    id: 'library',
    label: 'Task Library',
    icon: 'task-library',
    route: '/tasks/library',
  },
  {
    id: 'report',
    label: 'Report',
    icon: 'file-report',
    route: '/tasks/report',
  },
  {
    id: 'users',
    label: 'User management',
    icon: 'user-management',
    route: '/users',
    children: [
      {
        id: 'user-info',
        label: 'User information',
        icon: 'user-cog',
        route: '/tasks/info',
      },
      {
        id: 'store-info',
        label: 'Store information',
        icon: 'store-cog',
        route: '/tasks/store-info',
      },
    ],
  },
];

// SVG icon components mapping
export const svgIconMap: Record<string, (className: string, color: string) => JSX.Element> = {
  'gg-list': (className, color) => (
    <svg className={className} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M19 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H19C19.2652 18 19.5196 17.8946 19.7071 17.7071C19.8946 17.5196 20 17.2652 20 17V3C20 2.73478 19.8946 2.48043 19.7071 2.29289C19.5196 2.10536 19.2652 2 19 2ZM3 0C2.20435 0 1.44129 0.316071 0.87868 0.87868C0.31607 1.44129 0 2.20435 0 3V17C0 17.7956 0.31607 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H19C19.7956 20 20.5587 19.6839 21.1213 19.1213C21.6839 18.5587 22 17.7956 22 17V3C22 2.20435 21.6839 1.44129 21.1213 0.87868C20.5587 0.316071 19.7956 0 19 0H3ZM5 5H7V7H5V5ZM10 5C9.73478 5 9.48043 5.10536 9.29289 5.29289C9.10536 5.48043 9 5.73478 9 6C9 6.26522 9.10536 6.51957 9.29289 6.70711C9.48043 6.89464 9.73478 7 10 7H16C16.2652 7 16.5196 6.89464 16.7071 6.70711C16.8946 6.51957 17 6.26522 17 6C17 5.73478 16.8946 5.48043 16.7071 5.29289C16.5196 5.10536 16.2652 5 16 5H10ZM7 9H5V11H7V9ZM9 10C9 9.73478 9.10536 9.48043 9.29289 9.29289C9.48043 9.10536 9.73478 9 10 9H16C16.2652 9 16.5196 9.10536 16.7071 9.29289C16.8946 9.48043 17 9.73478 17 10C17 10.2652 16.8946 10.5196 16.7071 10.7071C16.5196 10.8946 16.2652 11 16 11H10C9.73478 11 9.48043 10.8946 9.29289 10.7071C9.10536 10.5196 9 10.2652 9 10ZM7 13H5V15H7V13ZM9 14C9 13.7348 9.10536 13.4804 9.29289 13.2929C9.48043 13.1054 9.73478 13 10 13H16C16.2652 13 16.5196 13.1054 16.7071 13.2929C16.8946 13.4804 17 13.7348 17 14C17 14.2652 16.8946 14.5196 16.7071 14.7071C16.5196 14.8946 16.2652 15 16 15H10C9.73478 15 9.48043 14.8946 9.29289 14.7071C9.10536 14.5196 9 14.2652 9 14Z" fill={color}/>
    </svg>
  ),
  'task-daily': (className, color) => (
    <svg className={className} viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 11.25V5.25C12.5 3.129 12.5 2.06775 11.8408 1.40925C11.1823 0.75 10.121 0.75 8 0.75H5C2.879 0.75 1.81775 0.75 1.15925 1.40925C0.5 2.06775 0.5 3.129 0.5 5.25V11.25C0.5 13.371 0.5 14.4323 1.15925 15.0908C1.81775 15.75 2.879 15.75 5 15.75H8C10.121 15.75 11.1823 15.75 11.8408 15.0908C12.5 14.4323 12.5 13.371 12.5 11.25Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.125 7.5L3.875 8.25L5.375 6.375M7.25 12H9.5M7.25 7.5H9.5M9.125 0.75H3.875C3.875 1.8105 3.875 2.34075 4.205 2.67C4.53425 3 5.0645 3 6.125 3H6.875C7.9355 3 8.46575 3 8.795 2.67C9.125 2.34075 9.125 1.8105 9.125 0.75Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.86755 11.9003H3.87505" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'task-pin': (className, color) => (
    <svg className={className} viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.0625 5H12.875C13.1734 5 13.4595 5.11853 13.6705 5.3295C13.8815 5.54048 14 5.82663 14 6.125V13.5342C13.9999 13.8324 13.8815 14.1184 13.6708 14.3292L10.9542 17.0458C10.7434 17.2565 10.4574 17.3749 10.1592 17.375H1.625C1.32663 17.375 1.04048 17.2565 0.829505 17.0455C0.618526 16.8345 0.5 16.5484 0.5 16.25V6.125C0.5 5.82663 0.618526 5.54048 0.829505 5.3295C1.04048 5.11853 1.32663 5 1.625 5H4.4375" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.5 17.375V14C9.5 13.7016 9.61853 13.4155 9.8295 13.2045C10.0405 12.9935 10.3266 12.875 10.625 12.875H14M7.25 3.875C6.80245 3.875 6.37323 3.69721 6.05676 3.38074C5.74029 3.06427 5.5625 2.63505 5.5625 2.1875C5.5625 1.73995 5.74029 1.31072 6.05676 0.994257C6.37323 0.67779 6.80245 0.5 7.25 0.5C7.69755 0.5 8.12677 0.67779 8.44324 0.994257C8.75971 1.31072 8.9375 1.73995 8.9375 2.1875C8.9375 2.63505 8.75971 3.06427 8.44324 3.38074C8.12677 3.69721 7.69755 3.875 7.25 3.875ZM7.25 3.875V7.8125M3.3125 10.625H11.1875M3.3125 14H6.6875" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'message': (className, color) => (
    <svg className={className} viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.5 0.5H2.5C1.39543 0.5 0.5 1.39543 0.5 2.5V10.5C0.5 11.6046 1.39543 12.5 2.5 12.5H14.5C15.6046 12.5 16.5 11.6046 16.5 10.5V2.5C16.5 1.39543 15.6046 0.5 14.5 0.5Z" stroke={color}/>
      <path d="M0.5 3.5L7.606 7.053C7.8836 7.19172 8.18967 7.26393 8.5 7.26393C8.81033 7.26393 9.1164 7.19172 9.394 7.053L16.5 3.5" stroke={color}/>
    </svg>
  ),
  'task-edit': (className, color) => (
    <svg className={className} viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 11.001V7.001C17 4.173 17 2.758 16.121 1.88C15.243 1 13.828 1 11 1H7C4.172 1 2.757 1 1.879 1.88C1 2.758 1 4.173 1 7V15C1 17.83 1 19.244 1.879 20.122C2.757 21.001 4.172 21.001 7 21.001H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 14.001H9M5 10.001H13M12.5 1.00101H5.5C5.5 2.41501 5.5 3.12201 5.94 3.56101C6.378 4.00101 7.085 4.00101 8.5 4.00101H9.5C10.914 4.00101 11.621 4.00101 12.06 3.56101C12.5 3.12201 12.5 2.41501 12.5 1.00101ZM13.737 20.654L12 21.001L12.347 19.264C12.417 18.911 12.591 18.588 12.846 18.334L16.911 14.268C16.9955 14.1833 17.0959 14.1162 17.2064 14.0704C17.3169 14.0245 17.4354 14.0009 17.555 14.0009C17.6746 14.0009 17.7931 14.0245 17.9036 14.0704C18.0141 14.1162 18.1145 14.1833 18.199 14.268L18.733 14.802C18.8177 14.8865 18.8848 14.9869 18.9307 15.0974C18.9765 15.2079 19.0001 15.3264 19.0001 15.446C19.0001 15.5656 18.9765 15.6841 18.9307 15.7946C18.8848 15.9051 18.8177 16.0055 18.733 16.09L14.668 20.155C14.4146 20.4107 14.0903 20.5845 13.737 20.654Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'task-library': (className, color) => (
    <svg className={className} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.44446 3.96333C5.44446 3.17741 5.75667 2.42367 6.3124 1.86794C6.86813 1.31221 7.62187 1 8.40779 1H18.0367C18.4258 1 18.8112 1.07665 19.1707 1.22557C19.5302 1.37449 19.8569 1.59277 20.1321 1.86794C20.4072 2.14311 20.6255 2.46979 20.7744 2.82931C20.9234 3.18884 21 3.57418 21 3.96333V13.5922C21 13.9814 20.9234 14.3667 20.7744 14.7262C20.6255 15.0858 20.4072 15.4124 20.1321 15.6876C19.8569 15.9628 19.5302 16.1811 19.1707 16.33C18.8112 16.4789 18.4258 16.5556 18.0367 16.5556H8.40779C7.62187 16.5556 6.86813 16.2433 6.3124 15.6876C5.75667 15.1319 5.44446 14.3781 5.44446 13.5922V3.96333Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.12444 5.73335C1.78333 5.92716 1.49961 6.20781 1.30211 6.5468C1.10461 6.88579 1.00038 7.27102 1 7.66335V18.7745C1 19.9967 2 20.9967 3.22222 20.9967H14.3333C15.1667 20.9967 15.62 20.5689 16 19.8856M9.88889 5.44446H15.4444M9.88889 8.77779H16.5556M9.88889 12.1111H13.2222" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'file-report': (className, color) => (
    <svg className={className} viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0H2C0.9 0 0 0.9 0 2V18C0 19.1 0.9 20 2 20H14C15.1 20 16 19.1 16 18V6L10 0ZM14 18H2V2H9V7H14V18ZM5 11V17H3V11H5ZM11 13V17H13V13H11ZM7 9V17H9V9H7Z" fill={color}/>
    </svg>
  ),
  'user-management': (className, color) => (
    <svg className={className} viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.7558 11.7618H4.83535C4.31546 11.7618 3.81687 11.9684 3.44926 12.336C3.08165 12.7036 2.87512 13.2022 2.87512 13.7221V15.0289H4.18194V13.7221C4.18194 13.5488 4.25078 13.3826 4.37332 13.26C4.49586 13.1375 4.66205 13.0687 4.83535 13.0687H8.7558C8.9291 13.0687 9.0953 13.1375 9.21783 13.26C9.34037 13.3826 9.40921 13.5488 9.40921 13.7221V15.0289H10.716V13.7221C10.716 13.2022 10.5095 12.7036 10.1419 12.336C9.77428 11.9684 9.27569 11.7618 8.7558 11.7618ZM6.79558 11.1084C7.3125 11.1084 7.81782 10.9552 8.24763 10.668C8.67744 10.3808 9.01244 9.97258 9.21026 9.495C9.40808 9.01742 9.45984 8.4919 9.35899 7.98491C9.25814 7.47791 9.00922 7.01221 8.6437 6.64668C8.27817 6.28116 7.81247 6.03223 7.30547 5.93139C6.79848 5.83054 6.27296 5.8823 5.79538 6.08012C5.3178 6.27794 4.90961 6.61293 4.62242 7.04274C4.33523 7.47255 4.18194 7.97787 4.18194 8.4948C4.18194 9.18798 4.4573 9.85277 4.94746 10.3429C5.43761 10.8331 6.1024 11.1084 6.79558 11.1084ZM6.79558 7.18798C7.05404 7.18798 7.3067 7.26463 7.52161 7.40822C7.73651 7.55182 7.90401 7.75592 8.00292 7.9947C8.10183 8.23349 8.12771 8.49625 8.07728 8.74975C8.02686 9.00325 7.9024 9.2361 7.71964 9.41886C7.53687 9.60162 7.30402 9.72609 7.05052 9.77651C6.79703 9.82693 6.53427 9.80106 6.29548 9.70215C6.05669 9.60324 5.85259 9.43574 5.709 9.22083C5.5654 9.00593 5.48876 8.75327 5.48876 8.4948C5.48876 8.14821 5.62644 7.81582 5.87152 7.57074C6.11659 7.32567 6.44899 7.18798 6.79558 7.18798Z" fill={color}/>
      <path d="M17.25 11.1079V16.9886H1.56817V3.92037H9.40908V2.61356H1.56817C1.22158 2.61356 0.889187 2.75124 0.644111 2.99631C0.399035 3.24139 0.261353 3.57378 0.261353 3.92037V16.9886C0.261353 17.3351 0.399035 17.6675 0.644111 17.9126C0.889187 18.1577 1.22158 18.2954 1.56817 18.2954H17.25C17.5966 18.2954 17.929 18.1577 18.174 17.9126C18.4191 17.6675 18.5568 17.3351 18.5568 16.9886V11.1079H17.25Z" fill={color} stroke={color} strokeWidth="0.522727"/>
      <path d="M12.0229 11.108H15.9433V12.4148H12.0229V11.108ZM13.3297 13.7216H15.9433V15.0284H13.3297V13.7216ZM19.8638 5.22727V3.92045H18.491C18.4062 3.51159 18.2438 3.12276 18.0127 2.77503L18.9863 1.80145L18.0623 0.877528L17.0888 1.85111C16.741 1.61994 16.3522 1.45758 15.9433 1.37281V0H14.6365V1.37281C14.2277 1.45758 13.8388 1.61994 13.4911 1.85111L12.5175 0.877528L11.5936 1.80145L12.5672 2.77503C12.336 3.12276 12.1736 3.51159 12.0889 3.92045H10.7161V5.22727H12.0889C12.1736 5.63614 12.336 6.02496 12.5672 6.3727L11.5936 7.34628L12.5175 8.2702L13.4911 7.29662C13.8388 7.52778 14.2277 7.69015 14.6365 7.77492V9.14773H15.9433V7.77492C16.3522 7.69015 16.741 7.52778 17.0888 7.29662L18.0623 8.2702L18.9863 7.34628L18.0127 6.3727C18.2438 6.02496 18.4062 5.63614 18.491 5.22727H19.8638ZM15.2899 6.53409C14.9022 6.53409 14.5232 6.41913 14.2009 6.20373C13.8785 5.98834 13.6273 5.6822 13.4789 5.32401C13.3305 4.96583 13.2917 4.57169 13.3674 4.19144C13.443 3.8112 13.6297 3.46192 13.9038 3.18777C14.178 2.91363 14.5273 2.72694 14.9075 2.6513C15.2878 2.57567 15.6819 2.61449 16.0401 2.76285C16.3983 2.91122 16.7044 3.16246 16.9198 3.48482C17.1352 3.80718 17.2502 4.18617 17.2502 4.57386C17.2496 5.09359 17.0429 5.59188 16.6754 5.95938C16.3079 6.32688 15.8097 6.53357 15.2899 6.53409Z" fill={color}/>
    </svg>
  ),
  'user-cog': (className, color) => (
    <svg className={className} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.48529 7.72801C9.49768 7.59939 9.55777 7.48008 9.65374 7.39355C9.7497 7.30702 9.87458 7.25956 10.0038 7.26051H10.8942C11.0233 7.25974 11.148 7.30728 11.2438 7.39379C11.3396 7.4803 11.3996 7.59952 11.412 7.72801C11.4254 7.87464 11.538 8.03118 11.7406 8.1346C11.7803 8.1549 11.8195 8.17615 11.8582 8.19835C12.0813 8.32585 12.2988 8.34922 12.456 8.2791C12.5721 8.22675 12.7033 8.21844 12.825 8.25572C12.9468 8.293 13.0508 8.37332 13.1176 8.48168L13.5625 9.21268C13.6308 9.32526 13.6527 9.46005 13.6233 9.58846C13.5939 9.71687 13.5157 9.82878 13.4052 9.90047C13.2784 9.98405 13.1906 10.1682 13.1941 10.414V10.482C13.1906 10.7278 13.2784 10.912 13.4052 10.9956C13.5157 11.0672 13.5939 11.1792 13.6233 11.3076C13.6527 11.436 13.6308 11.5708 13.5625 11.6833L13.1176 12.4143C13.0508 12.5227 12.9468 12.603 12.825 12.6403C12.7033 12.6776 12.5721 12.6693 12.456 12.6169C12.2988 12.5468 12.0813 12.5702 11.8582 12.6977C11.82 12.7194 11.7808 12.7407 11.7406 12.7614C11.538 12.8648 11.4254 13.0214 11.412 13.168C11.3996 13.2965 11.3396 13.4157 11.2438 13.5022C11.148 13.5887 11.0233 13.6363 10.8942 13.6355H10.0038C9.87458 13.6365 9.7497 13.589 9.65374 13.5025C9.55777 13.4159 9.49768 13.2966 9.48529 13.168C9.47254 13.0214 9.35992 12.8648 9.15734 12.7614C9.11765 12.7411 9.07844 12.7199 9.03975 12.6977C8.81663 12.5702 8.59917 12.5468 8.44192 12.6169C8.32585 12.6693 8.1947 12.6776 8.07295 12.6403C7.95121 12.603 7.84719 12.5227 7.78034 12.4143L7.3355 11.6833C7.26706 11.5708 7.24513 11.4361 7.27435 11.3077C7.30357 11.1793 7.38166 11.0674 7.49204 10.9956C7.61954 10.912 7.70738 10.7278 7.70384 10.482V10.414C7.70738 10.1682 7.61884 9.98405 7.49204 9.90047C7.38166 9.82867 7.30357 9.71671 7.27435 9.58831C7.24513 9.45991 7.26706 9.32518 7.3355 9.21268L7.78034 8.48168C7.84719 8.37332 7.95121 8.293 8.07295 8.25572C8.1947 8.21844 8.32585 8.22675 8.44192 8.2791C8.59917 8.34922 8.81663 8.32585 9.03975 8.19835C9.07847 8.17662 9.11767 8.15537 9.15734 8.1346C9.35992 8.03118 9.47254 7.87464 9.48529 7.72801ZM10.1603 7.96885C10.0626 8.34143 9.77642 8.61414 9.47892 8.76572L9.39109 8.81318C9.09075 8.9853 8.69409 9.09297 8.30521 8.98105L8.03321 9.42872C8.31725 9.6993 8.41642 10.0903 8.41217 10.4232V10.4728C8.41642 10.8057 8.31725 11.1967 8.03321 11.4673L8.30521 11.915C8.69409 11.8031 9.09146 11.9107 9.39109 12.0828C9.41942 12.0989 9.4487 12.1147 9.47892 12.1303C9.77642 12.2819 10.0626 12.5553 10.1603 12.9272H10.7376C10.8354 12.5546 11.1208 12.2819 11.419 12.1303L11.5069 12.0828C11.8072 11.9107 12.2039 11.8031 12.592 11.915L12.8648 11.4673C12.5807 11.1967 12.4815 10.8057 12.4858 10.4728V10.4232C12.4815 10.0903 12.5807 9.6993 12.8648 9.42872L12.592 8.98105C12.2039 9.09297 11.8072 8.9853 11.5069 8.81318L11.419 8.76572C11.1215 8.61414 10.8354 8.34072 10.7376 7.96885H10.1603ZM11.0096 10.1597C10.8368 9.87639 10.4387 9.7666 10.1207 9.94014C9.81325 10.1094 9.724 10.4643 9.88834 10.7363C10.0612 11.0196 10.4593 11.1294 10.7773 10.9559C11.0847 10.7866 11.174 10.4317 11.0096 10.1597ZM9.78067 9.31964C10.416 8.97185 11.2363 9.17089 11.6145 9.79139C11.9992 10.4239 11.7626 11.2236 11.1173 11.5764C10.4819 11.9242 9.66167 11.7251 9.28342 11.1046C8.89879 10.4721 9.13538 9.67239 9.78067 9.31964Z" fill={color}/>
      <path d="M5.49033 1.0625C4.56737 1.0625 3.84204 1.78925 3.84204 2.65625C3.84204 3.52325 4.56667 4.25 5.49033 4.25C6.414 4.25 7.13933 3.52325 7.13933 2.65625C7.13933 1.78925 6.414 1.0625 5.49033 1.0625ZM2.77954 2.65625C2.77954 1.17583 4.00637 0 5.49175 0C6.97642 0 8.20325 1.17583 8.20325 2.65625C8.20325 4.13667 6.97642 5.3125 5.49175 5.3125C4.00708 5.3125 2.77742 4.13667 2.77742 2.65625M3.69825 6.88217C3.56862 6.79929 3.47158 6.79433 3.42625 6.80638C3.32425 6.83471 3.22296 6.86493 3.12237 6.89704L2.42537 7.12017C2.18659 7.1937 1.96823 7.32186 1.78761 7.49448C1.60699 7.66711 1.46908 7.87945 1.38483 8.11467C1.36597 8.17742 1.35386 8.24201 1.34871 8.30733L1.07175 10.9275L1.07033 10.9367C1.01721 11.31 1.21625 11.5954 1.51871 11.6663C2.28158 11.8433 3.5665 12.0417 5.48962 12.0417C5.63052 12.0417 5.76565 12.0976 5.86527 12.1973C5.9649 12.2969 6.02087 12.432 6.02087 12.5729C6.02087 12.7138 5.9649 12.8489 5.86527 12.9486C5.76565 13.0482 5.63052 13.1042 5.48962 13.1042C3.49354 13.1042 2.12717 12.8973 1.27858 12.7004C0.365541 12.4886 -0.0970006 11.6308 0.0170411 10.7971L0.291874 8.19542C0.304624 8.07358 0.327291 7.92271 0.381124 7.76758C0.519271 7.3765 0.746616 7.02298 1.04514 6.73503C1.34366 6.44708 1.70515 6.23263 2.10096 6.10867L2.79867 5.88483C2.91342 5.84847 3.02864 5.81424 3.14433 5.78213C3.57712 5.66313 3.98867 5.8055 4.27483 5.99038C4.53692 6.16038 4.96475 6.36508 5.48962 6.36508C6.01379 6.36508 6.44162 6.15967 6.70371 5.98967C6.98917 5.8055 7.40142 5.66313 7.83421 5.78213C7.9499 5.81424 8.06512 5.84847 8.17987 5.88483L8.87758 6.10867C8.94539 6.12881 9.00849 6.16228 9.06318 6.20714C9.11787 6.25199 9.16306 6.30731 9.19609 6.36985C9.22912 6.4324 9.24932 6.50091 9.25552 6.57137C9.26172 6.64183 9.25378 6.71282 9.23218 6.78017C9.21058 6.84752 9.17575 6.90988 9.12972 6.96359C9.0837 7.01731 9.02741 7.06128 8.96417 7.09295C8.90092 7.12462 8.83199 7.14334 8.76141 7.14801C8.69083 7.15269 8.62004 7.14322 8.55317 7.12017L7.85617 6.89704C7.75527 6.86475 7.65372 6.83452 7.55158 6.80638C7.50696 6.79433 7.40992 6.79929 7.281 6.88217C6.91762 7.11733 6.28933 7.42758 5.48892 7.42758C4.6885 7.42758 4.06162 7.11733 3.69825 6.88217Z" fill={color}/>
    </svg>
  ),
  'store-cog': (className, color) => (
    <svg className={className} viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.625 1.25H0.625V0H10.625V1.25ZM10 5C8.80625 5 7.73125 5.475 6.94375 6.25H6.875V6.31875C6.1 7.10625 5.625 8.18125 5.625 9.375C5.625 9.5875 5.64375 9.79375 5.675 10H0.625V6.25H0V5L0.625 1.875H10.625L11.25 5V5.1875C10.8562 5.06875 10.4375 5 10 5ZM5.625 6.25H1.875V8.75H5.625V6.25ZM9.975 5L9.6 3.125H1.65L1.275 5H9.975ZM13 10.25C13.0625 10.25 13.0625 10.3125 13 10.375L12.375 11.4375C12.3125 11.5 12.25 11.5 12.1875 11.5L11.4375 11.25C11.25 11.375 11.125 11.4375 10.9375 11.5625L10.8125 12.375C10.8125 12.4375 10.75 12.5 10.6875 12.5H9.4375C9.375 12.5 9.3125 12.4375 9.25 12.375L9.125 11.5625C8.9375 11.5 8.75 11.375 8.625 11.25L7.875 11.5625C7.8125 11.5625 7.75 11.5625 7.6875 11.5L7.0625 10.4375C7 10.375 7.0625 10.3125 7.125 10.25L7.8125 9.75V9.125L7.125 8.625C7.0625 8.5625 7.0625 8.5 7.0625 8.4375L7.6875 7.375C7.75 7.3125 7.8125 7.3125 7.875 7.3125L8.625 7.625C8.8125 7.5 8.9375 7.4375 9.125 7.3125L9.25 6.5C9.25 6.4375 9.3125 6.375 9.4375 6.375H10.6875C10.75 6.375 10.8125 6.4375 10.8125 6.5L10.9375 7.3125C11.125 7.375 11.3125 7.5 11.5 7.625L12.25 7.3125C12.3125 7.3125 12.4375 7.3125 12.4375 7.375L13.0625 8.4375C13.125 8.5 13.0625 8.5625 13 8.625L12.3125 9.125V9.75L13 10.25ZM10.9375 9.375C10.9375 8.875 10.5 8.4375 10 8.4375C9.5 8.4375 9.0625 8.875 9.0625 9.375C9.0625 9.875 9.5 10.3125 10 10.3125C10.5 10.3125 10.9375 9.875 10.9375 9.375Z" fill={color}/>
    </svg>
  ),
};

// PNG icon paths mapping (for icons not yet converted to SVG)
export const pngIconMap: Record<string, string> = {
  // All icons have been converted to SVG
};

// Icon component
export function MenuIcon({ name, className = '', isActive = false }: { name: string; className?: string; isActive?: boolean }) {
  // Define colors
  const activeColor = '#C5055B';
  const defaultColor = '#6B7280'; // gray-500

  // Check if it's an SVG icon first
  if (svgIconMap[name]) {
    return svgIconMap[name](className, isActive ? activeColor : defaultColor);
  }

  // Check if it's a PNG icon
  if (pngIconMap[name]) {
    // Extract size from className (e.g., "w-5 h-5" -> 20)
    const sizeMatch = className.match(/w-(\d+)/);
    const size = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 20;

    // CSS filter for pink/red color (#C5055B) when active
    // Default: grayscale with slight opacity for gray look
    const activeFilter = 'invert(15%) sepia(95%) saturate(5000%) hue-rotate(330deg) brightness(85%) contrast(105%)';
    const defaultFilter = 'invert(45%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)';

    return (
      <Image
        src={pngIconMap[name]}
        alt={name}
        width={size}
        height={size}
        className={`flex-shrink-0 transition-all duration-200 ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          filter: isActive ? activeFilter : defaultFilter,
        }}
      />
    );
  }

  const iconMap: Record<string, JSX.Element> = {
    'list': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    'document': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    'chat': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    'check-circle': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'library': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
    'chart': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    'users': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  };

  return iconMap[name] || <span className={className}>?</span>;
}

export default function Sidebar() {
  const {
    isExpanded,
    toggleSidebar,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isMobile,
    isTablet,
    isDesktop
  } = useSidebar();
  const { expandedMenus, toggleMenu, collapseAllMenus, setIsNavigating } = useNavigation();
  const pathname = usePathname();
  const { showDevelopingToast } = useToast();
  const sidebarRef = useRef<HTMLElement>(null);

  // Handle click outside to collapse sidebar (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // On desktop, collapse sidebar if expanded
        if (isDesktop && isExpanded) {
          toggleSidebar();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, toggleSidebar, isDesktop]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  const isActive = (route: string) => {
    // Special case: /tasks/detail should be active for /tasks/[id] routes
    if (route === '/tasks/detail') {
      const taskDetailPattern = /^\/tasks\/(\d+|detail)$/;
      return taskDetailPattern.test(pathname);
    }
    if (pathname === route) return true;
    // Exclude standalone menu items and User Management children from parent /tasks menu
    if (route === '/tasks' && (
      pathname.startsWith('/tasks/todo') ||
      pathname.startsWith('/tasks/library') ||
      pathname.startsWith('/tasks/info') ||
      pathname.startsWith('/tasks/store-info') ||
      pathname.startsWith('/tasks/report')
    )) {
      return false;
    }
    return pathname.startsWith(route + '/');
  };

  const isImplemented = (route: string) => {
    return implementedRoutes.some(r => route === r || route.startsWith(r + '/'));
  };

  const isChildActive = (item: MenuItem) => {
    if (!item.children) return false;
    return item.children.some(child => isActive(child.route));
  };

  const handleNavigation = (e: React.MouseEvent, route: string, isChild: boolean, implemented: boolean) => {
    if (!implemented) {
      e.preventDefault();
      showDevelopingToast();
      return;
    }

    setIsNavigating(true);

    if (!isChild) {
      collapseAllMenus();
    }

    // Close mobile menu after navigation
    if (isMobile || isTablet) {
      setIsMobileMenuOpen(false);
    }
  };

  // Generate tooltip content with preview for parent items
  const getTooltipContent = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      return `${item.label} (${item.children.length} items)`;
    }
    return item.label;
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isMenuExpanded = expandedMenus.includes(item.id);
    const active = isActive(item.route) || isChildActive(item);
    const showExpanded = isExpanded || isMobileMenuOpen;

    if (hasChildren) {
      return (
        <div key={item.id} className="group/parent">
          <button
            onClick={() => toggleMenu(item.id)}
            title={!showExpanded ? getTooltipContent(item) : undefined}
            className={`group relative w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg transition-all duration-200
              ${active
                ? 'bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 text-[#C5055B] dark:text-pink-400 shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 dark:hover:from-gray-700 dark:hover:to-gray-600/50'
              }
              hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] transform-gpu`}
          >
            {/* Active indicator bar */}
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ease-out ${
                active ? 'h-6 bg-gradient-to-b from-[#C5055B] to-[#E5457B]' : 'h-0 bg-transparent'
              }`}
            />

            {/* Ripple effect on click */}
            <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
              <span className="absolute inset-0 bg-[#C5055B] opacity-0 group-active:opacity-10 transition-opacity duration-150" />
            </div>

            <MenuIcon
              name={item.icon}
              className={`w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:rotate-3 ${active ? 'text-[#C5055B] dark:text-pink-400' : ''}`}
              isActive={active}
            />
            {showExpanded && (
              <>
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1 text-left transition-colors duration-200">
                  {item.label}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ease-out ${isMenuExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}

          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              isMenuExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className={`mt-1 space-y-1 ${showExpanded ? 'ml-4 dark:border-gray-700' : ''}`}>
              {item.children?.map(child => renderMenuItem(child, true))}
            </div>
          </div>
        </div>
      );
    }

    const implemented = isImplemented(item.route);
    // When sidebar is collapsed, child items have slight left padding to show hierarchy
    const collapsedChildStyle = isChild && !showExpanded ? 'pl-5 pr-2' : 'px-3';

    return (
      <Link
        key={item.id}
        href={implemented ? item.route : '#'}
        onClick={(e) => handleNavigation(e, item.route, isChild, implemented)}
        title={!showExpanded ? item.label : undefined}
        className={`group relative flex items-center gap-3 py-3 md:py-2.5 rounded-lg transition-all duration-200 ${collapsedChildStyle} ${isChild && showExpanded ? 'ml-2 px-3' : ''}
          ${isActive(item.route)
            ? 'bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 text-[#C5055B] dark:text-pink-400 shadow-sm'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 dark:hover:from-gray-700 dark:hover:to-gray-600/50'
          }
          hover:scale-[1.02] hover:shadow-sm active:scale-[0.98] transform-gpu`}
      >
        {/* Active indicator bar */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ease-out ${
            isActive(item.route) ? 'h-6 bg-gradient-to-b from-[#C5055B] to-[#E5457B]' : 'h-0 bg-transparent'
          }`}
        />

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <span className="absolute inset-0 bg-[#C5055B] opacity-0 group-active:opacity-10 transition-opacity duration-150" />
        </div>

        <MenuIcon
          name={item.icon}
          className={`${isChild ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:rotate-3 ${isActive(item.route) ? 'text-[#C5055B] dark:text-pink-400' : ''}`}
          isActive={isActive(item.route)}
        />
        {showExpanded && (
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-colors duration-200">
            {item.label}
          </span>
        )}
        {item.badge && showExpanded && (
          <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  // Mobile/Tablet: Show overlay sidebar
  if (isMobile || isTablet) {
    return (
      <>
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar drawer */}
        <aside
          ref={sidebarRef}
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Menu Items with scroll improvements */}
          <div className="relative h-full">
            {/* Top fade gradient */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-[1] pointer-events-none" />

            <nav className="p-4 pt-14 pb-8 space-y-1 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
              {menuItems.map(item => renderMenuItem(item))}
            </nav>

            {/* Bottom fade gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
          </div>
        </aside>
      </>
    );
  }

  // Desktop: Regular sidebar
  return (
    <aside
      ref={sidebarRef}
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
        isExpanded ? 'w-60' : 'w-16'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110 z-10"
      >
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Menu Items with scroll improvements */}
      <div className="relative h-full">
        {/* Top fade gradient */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-[1] pointer-events-none" />

        <nav className="p-3 pb-6 space-y-1 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
      </div>
    </aside>
  );
}
