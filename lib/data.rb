class DataParser

  attr_accessor :target_data

  def initialize(target_data)
    @target_data = get_data(target_data)
  end

  def get_data(region_name)
    files = Dir.glob("data/population_data.csv")
    raw_lines = ''

    files.each do |file|
      raw_lines = IO.readlines(file)
    end

    raw_lines.each do |line|
      line.delete!("\n")
    end

    array_of_rows = raw_lines.each_slice(1).to_a
    array_of_split_rows = []
    array_of_rows.each do |row|
      array_of_split_rows << row[0].split(',')
    end

    array_of_split_rows.each do |row|
      if row.include?(region_name)
        return row[1..-1]
      end
    end

  end

end

test = DataParser.new("GLakes")


class Region
  attr_accessor :population_data, :circle_count, :coordinate_count

  def initialize(region)
    @name
    @population_data = DataParser.new(region)
    @circle_counts = []
  end

  def circle_count
    @population_data.target_data.each do |year|
      _year = year.to_i
      if _year > 0 && _year < 10
        @circle_counts << 1
      elsif _year >= 10 && _year < 20
        @circle_counts << 2
      else
        @circle_counts << _year / 20
      end
    end
    @circle_counts
  end

  def coordinate_count
    circle_count.max
  end

  def generate_radius_arrays
    radius_arrays = []
    coordinate_count.times do
      radius_arrays << []
    end
  end

end

# test_1 = Region.new("GLakes")
test_1 = Region.new("NRockies")
# test_1 = Region.new("PacNW")
p test_1.circle_count
p test_1.coordinate_count
