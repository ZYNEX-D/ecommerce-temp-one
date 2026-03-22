import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

/**
 * Custom-styled SweetAlert2 utility for the Apex Auto theme.
 */
const apexSwal = MySwal.mixin({
    customClass: {
        popup: 'rounded-2xl border border-surface-200 shadow-2xl p-8 font-outfit',
        title: 'text-3xl font-black text-surface-950 uppercase tracking-tight',
        htmlContainer: 'text-surface-500 font-medium text-lg leading-relaxed',
        confirmButton: 'px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl transition-all duration-300 shadow-lg shadow-brand-600/20 active:scale-95 uppercase tracking-widest text-sm',
        cancelButton: 'px-8 py-4 bg-surface-200 hover:bg-surface-300 text-surface-700 font-black rounded-xl transition-all duration-300 active:scale-95 uppercase tracking-widest text-sm ml-4',
    },
    buttonsStyling: false,
});

export const alerts = {
    /**
     * Show a success alert
     */
    success: (title: string, text?: string) => {
        return apexSwal.fire({
            icon: 'success',
            title,
            text,
            timer: 2500,
            timerProgressBar: true,
            iconColor: '#dc2626', // brand-600
        });
    },

    /**
     * Show an error alert
     */
    error: (title: string, text?: string) => {
        return apexSwal.fire({
            icon: 'error',
            title,
            text,
            iconColor: '#dc2626',
        });
    },

    /**
     * Show a confirmation dialog
     * @returns boolean indicating if the user confirmed
     */
    confirm: async (title: string, text: string) => {
        const result = await apexSwal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, proceed',
            cancelButtonText: 'Cancel',
            iconColor: '#dc2626',
        });
        return result.isConfirmed;
    },

    /**
     * Show an info alert
     */
    info: (title: string, text: string) => {
        return apexSwal.fire({
            icon: 'info',
            title,
            text,
            iconColor: '#64748b', // accent-500
        });
    },

    /**
     * Generic toast notification
     */
    toast: (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
        return apexSwal.fire({
            title,
            icon,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            iconColor: icon === 'success' ? '#dc2626' : undefined,
        });
    }
};
