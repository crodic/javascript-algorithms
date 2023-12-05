const Paginate = async (req, res, next) => {
    const query = { ...req.query };
    // Tách Các Field Đặc biệt ra khỏi query để không xử lý logic các field này
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((item) => delete query[item]);

    // 1. Filter
    // Format lại các operators cho đúng định dạng
    let queryString = JSON.stringify(query);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (element) => `$${element}`); // Thêm $ ở trước cho phù hợp với cú pháp mongoose
    const formatQuery = JSON.parse(queryString);

    // Tìm Theo Title nếu có 1 chữ cũng sẽ ra kết quả
    if (query?.title) formatQuery.title = { $regex: query.title, $options: 'i' }; // Regex không phân biệt hoa thường
    // Nêú ko tách các field đặc biệt thì tại đây formatQuery sẽ tìm theo điều kiện rác => Không trả về bắt cứ gì
    let queryCommand = ProductModel.find(formatQuery).populate('rating.postedBy'); // populate 1 giá trị object trong 1 array dùng [Array].[Object-Key]

    // 2. Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // 3.Limit
    if (req.query.fields) {
        const fieldsBy = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fieldsBy);
    }

    // 4. Pagination
    // limit: Số document trả về
    // page: Số Trang
    // skip: Số Lượng Phần Tử Bỏ Quả
    // Công Thức Phân Trang: skip = (page - 1) * limit
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    const runQuery = await queryCommand.exec();
    const counts = await ProductModel.find(formatQuery).countDocuments();

    return res.status(200).json({
        success: true,
        total: counts,
        page: page,
        total_page: Math.ceil(counts / limit),
        products: runQuery,
    });
};
