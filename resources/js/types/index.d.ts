export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'superadmin' | 'bidan' | 'ibu_hamil' | string;
    no_telepon?: string | null;
    nik?: string | null;
    tanggal_lahir?: string | null;
    pekerjaan?: string | null;
    pendidikan?: string | null;
    hpht?: string | null;
    puskesmas?: string | null;
}

export type PageProps<T = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
        screeningResult?: any;
    };
};
