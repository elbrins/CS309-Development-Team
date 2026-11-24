import React, { useState } from 'react';

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);

    const [user, setUser] = useState({
        fullName: 'NAME',
        email: 'EmailName@example.com',
        password: '********',
        role: 'Student',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleEdit = (e) => {
        e.preventDefault();
        setIsEditing((prev) => !prev);
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>My Profile</h2>
                <p style={styles.subtitle}>
                    {isEditing ? 'Update your account details' : 'View and manage your profile'}
                </p>

                <form onSubmit={handleToggleEdit} style={styles.form}>
                    {/* Full Name */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Full Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="fullName"
                                value={user.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                style={styles.input}
                                required
                            />
                        ) : (
                            <div style={styles.plainText}>{user.fullName}</div>
                        )}
                    </div>

                    {/* Email Address */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Email Address</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                style={styles.input}
                                required
                            />
                        ) : (
                            <div style={styles.plainText}>{user.email}</div>
                        )}
                    </div>

                    {/* Password */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Password</label>
                        {isEditing ? (
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                style={styles.input}
                                required
                            />
                        ) : (
                            <div style={styles.plainText}>••••••••</div>
                        )}
                    </div>

                    {/* Role */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Role</label>
                        {isEditing ? (
                            <select
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                                style={styles.input}
                            >
                                <option value="Student">Student</option>
                                <option value="Admin">Admin</option>
                                <option value="Librarian">Librarian</option>
                            </select>
                        ) : (
                            <div style={styles.roleBadge}>{user.role}</div>
                        )}
                    </div>

                    <button type="submit" style={styles.button}>
                        {isEditing ? 'Save Changes' : 'Edit'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f5f6fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
    },
    card: {
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '400px',
        padding: '36px 32px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    },
    title: {
        margin: '0 0 6px 0',
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a1a1a',
        textAlign: 'center',
    },
    subtitle: {
        margin: '0 0 24px 0',
        fontSize: '13px',
        color: '#7a7a7a',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#333333',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        fontSize: '14px',
        borderRadius: '6px',
        border: '1px solid #dcdcdc',
        outline: 'none',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
        color: '#222222',
    },
    plainText: {
        fontSize: '15px',
        color: '#222222',
        padding: '4px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    roleBadge: {
        display: 'inline-block',
        alignSelf: 'flex-start',
        backgroundColor: '#eeeeff',
        color: '#5b5ce6',
        fontWeight: '600',
        fontSize: '13px',
        padding: '4px 12px',
        borderRadius: '20px',
    },
    button: {
        marginTop: '10px',
        width: '100%',
        padding: '11px',
        backgroundColor: '#5b5ce6',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};