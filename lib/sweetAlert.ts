import Swal from 'sweetalert2';

// Success Alert with auto close and progress bar
export const showSuccessAlert = (title: string, message?: string, timer = 2000) => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    background: '#fff',
    iconColor: '#10b981',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
};

// Error Alert with auto close and progress bar
export const showErrorAlert = (title: string, message?: string, timer = 3000) => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    background: '#fff',
    iconColor: '#ef4444',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
};

// Warning Alert with auto close and progress bar
export const showWarningAlert = (title: string, message?: string, timer = 2500) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text: message,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    background: '#fff',
    iconColor: '#f59e0b',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
};

// Info Alert with auto close and progress bar
export const showInfoAlert = (title: string, message?: string, timer = 2000) => {
  return Swal.fire({
    icon: 'info',
    title,
    text: message,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    background: '#fff',
    iconColor: '#3b82f6',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
};

// Confirmation Dialog (for delete, etc.)
export const showConfirmDialog = async (
  title: string,
  message: string,
  confirmButtonText = 'Yes, delete it!',
  cancelButtonText = 'Cancel'
) => {
  return Swal.fire({
    title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
  });
};

// Loading Alert
export const showLoadingAlert = (title = 'Loading...', message?: string) => {
  return Swal.fire({
    title,
    text: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Close any open alert
export const closeAlert = () => {
  Swal.close();
};
