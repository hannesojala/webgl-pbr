function IDMat() {
    return new DOMMatrix([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

function addv(A, B) {
    if (A.length != B.length) {
        return -1;
    }
    let C = Array(A.length);
    for (var i = 0; i < A.length; i++) {
        C[i] = A[i]+B[i];
    }
    return C;
}

function subv(A, B) {
    if (A.length != B.length) {
        return -1;
    }
    let C = Array(A.length);
    for (var i = 0; i < A.length; i++) {
        C[i] = A[i]-B[i];
    }
    return C;
}

function scalev(A, S) {
    return [A[0] * S, A[1] * S, A[2] * S];
}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

function norm(A) {
    let len = Math.sqrt(A[0]*A[0] + A[1]*A[1] + A[2]*A[2]);
    if (len == 0) return A;
    return [A[0]/len, A[1]/len, A[2]/len];
}

function cross(A, B) {
    return [
        A[1] * B[2] - A[2] * B[1],
        A[2] * B[0] - A[0] * B[2],
        A[0] * B[1] - A[1] * B[0]
    ];
}

function dot(A, B) {
    let prod = 0;
    for (var i = 0; i < A.length; i++) {
        prod += A[i]*B[i];
    }
    return prod;
}

function lengthv(A) {
    return Math.sqrt(A[0]*A[0] + A[1]*A[1] + A[2]*A[2]);
}