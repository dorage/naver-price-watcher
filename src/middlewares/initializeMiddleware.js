import Term from '../models/Term';

export const createDefaultTerm = async (req, res) => {
    if (await Term.countDocuments()) {
        return;
    }
    const newTerm = new Term({ term: '바른엔젤체어2' });
    await newTerm.save();
    return;
};
