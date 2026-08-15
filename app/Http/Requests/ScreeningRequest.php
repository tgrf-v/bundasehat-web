<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScreeningRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'nama_pasien' => ['required', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:20'],
            'umur' => ['required', 'integer', 'min:10', 'max:60'],
            'paritas' => ['required', 'integer', 'min:0', 'max:15'],
            'hpht' => ['nullable', 'string'],
            'sistolik' => ['required', 'integer', 'min:60', 'max:240'],
            'diastolik' => ['required', 'integer', 'min:40', 'max:160'],
            'edema_level' => ['required', 'string', 'in:none,ringan_kaki,sedang_tungkai,berat_wajah_tangan,bengkak_muka_tangan'],
            'keluhan_spesifik' => ['nullable', 'array'],
            'keluhan_spesifik.*' => ['string'],
            'sudah_dapat_treatment' => ['required', 'boolean'],
            'detail_treatment' => ['nullable', 'string', 'max:500'],
            'tipe_screening' => ['required', 'string', 'in:kehamilan,persalinan'],
            'wilayah_puskesmas' => ['nullable', 'string', 'max:255'],
        ];

        // Validasi tambahan untuk form persalinan
        if ($this->input('tipe_screening') === 'persalinan') {
            $rules['posisi_janin'] = ['nullable', 'string', 'in:kepala_bawah,sungsang,lintang'];
            $rules['ada_riwayat_sc'] = ['nullable', 'boolean'];
            $rules['kondisi_ketuban'] = ['nullable', 'string', 'in:utuh,pecah,mekonium'];
        }

        return $rules;
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama_pasien.required' => 'Nama pasien wajib diisi.',
            'umur.required' => 'Umur wajib diisi.',
            'umur.min' => 'Umur minimal 10 tahun.',
            'umur.max' => 'Umur maksimal 60 tahun.',
            'paritas.required' => 'Paritas wajib diisi.',
            'paritas.min' => 'Paritas tidak boleh negatif.',
            'sistolik.required' => 'Tekanan darah sistolik wajib diisi.',
            'sistolik.min' => 'Tekanan sistolik minimal 60 mmHg.',
            'sistolik.max' => 'Tekanan sistolik maksimal 240 mmHg.',
            'diastolik.required' => 'Tekanan darah diastolik wajib diisi.',
            'diastolik.min' => 'Tekanan diastolik minimal 40 mmHg.',
            'diastolik.max' => 'Tekanan diastolik maksimal 160 mmHg.',
            'edema_level.in' => 'Tingkat edema tidak valid.',
            'tipe_screening.required' => 'Tipe screening wajib diisi.',
            'tipe_screening.in' => 'Tipe screening harus kehamilan atau persalinan.',
        ];
    }
}
